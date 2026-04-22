import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

const CERT_DIR = path.resolve(process.cwd(), "certificates");

const safe = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");

export function generateCertificate(user, course) {
  return new Promise((resolve, reject) => {
    try {
      fs.mkdirSync(CERT_DIR, { recursive: true });

      const userLabel = user?.fullName || user?.email || user?.phoneNumber || "Learner";
      const courseLabel = course?.title || "Course";
      const fileName = `${safe(String(user?._id))}-${safe(String(course?._id))}-${Date.now()}.pdf`;
      const filePath = path.join(CERT_DIR, fileName);

      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      doc.rect(30, 30, 535, 782).lineWidth(2).stroke("#0A5E53");
      doc.moveDown(2);

      doc
        .fontSize(34)
        .fillColor("#0A2E2A")
        .text("Certificate of Completion", { align: "center" });

      doc.moveDown(2);
      doc.fontSize(14).fillColor("#444").text("This certifies that", { align: "center" });
      doc.moveDown(0.6);

      doc.fontSize(28).fillColor("#0A5E53").text(userLabel, { align: "center" });
      doc.moveDown(0.8);

      doc.fontSize(14).fillColor("#444").text("has successfully completed", { align: "center" });
      doc.moveDown(0.8);

      doc.fontSize(22).fillColor("#0A2E2A").text(courseLabel, { align: "center" });
      doc.moveDown(2);

      doc
        .fontSize(12)
        .fillColor("#666")
        .text(`Issued on: ${new Date().toLocaleDateString()}`, { align: "center" });

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
}
