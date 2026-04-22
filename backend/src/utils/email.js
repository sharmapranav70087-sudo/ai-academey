import fs from "fs/promises";
import path from "path";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export async function sendCertificateEmail({ to, filePath }) {
  if (!to || !filePath) {
    throw new Error("sendCertificateEmail: missing recipient or filePath");
  }

  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "AI Academy";

  if (!apiKey) throw new Error("BREVO_API_KEY is missing");
  if (!senderEmail) throw new Error("BREVO_SENDER_EMAIL is missing");

  const fileBuffer = await fs.readFile(filePath);
  const attachmentName = path.basename(filePath);

  const payload = {
    sender: { email: senderEmail, name: senderName },
    to: [{ email: to }],
    subject: "Your Certificate",
    textContent: "Congratulations! Your certificate is attached.",
    attachment: [{ name: attachmentName, content: fileBuffer.toString("base64") }]
  };

  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
      Accept: "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo email failed (${res.status}): ${body}`);
  }

  return true;
}
