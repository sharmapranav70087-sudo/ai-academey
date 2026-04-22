import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("../src/models/Certificate.js", () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn()
  }
}));

vi.mock("../src/models/User.js", () => ({
  default: {
    findById: vi.fn()
  }
}));

vi.mock("../src/models/Course.js", () => ({
  default: {
    findById: vi.fn()
  }
}));

vi.mock("../src/utils/certificate.js", () => ({
  generateCertificate: vi.fn()
}));

vi.mock("../src/utils/email.js", () => ({
  sendCertificateEmail: vi.fn()
}));

import Certificate from "../src/models/Certificate.js";
import User from "../src/models/User.js";
import Course from "../src/models/Course.js";
import { generateCertificate } from "../src/utils/certificate.js";
import { sendCertificateEmail } from "../src/utils/email.js";
import { handleCertificate } from "../src/services/certificate.service.js";

const lean = (value) => ({ lean: vi.fn().mockResolvedValue(value) });

describe("handleCertificate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.BREVO_TEST_TO;
  });

  afterEach(() => {
    delete process.env.BREVO_TEST_TO;
  });

  it("creates certificate and sends email when user reaches 100%", async () => {
    User.findById.mockReturnValue(lean({ _id: "u1", fullName: "Pranav", email: "user@test.com" }));
    Course.findById.mockReturnValue(lean({ _id: "c1", title: "AI Basics" }));
    Certificate.findOne.mockReturnValue(lean(null));
    generateCertificate.mockResolvedValue("/tmp/c1.pdf");
    sendCertificateEmail.mockResolvedValue(true);

    await handleCertificate("u1", {
      global: { percentage: 100 },
      courses: [{ courseId: "c1", percentage: 100 }]
    });

    expect(Certificate.create).toHaveBeenCalledTimes(1);
    expect(Certificate.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "u1",
        courseId: "c1",
        certificateUrl: expect.stringContaining("/certificates/")
      })
    );
    expect(sendCertificateEmail).toHaveBeenCalledWith({
      to: "user@test.com",
      filePath: "/tmp/c1.pdf"
    });
  });

  it("does not create duplicate certificate if already exists", async () => {
    User.findById.mockReturnValue(lean({ _id: "u1", fullName: "Pranav", email: "user@test.com" }));
    Certificate.findOne.mockReturnValue(lean({ _id: "existing-cert" }));

    await handleCertificate("u1", {
      global: { percentage: 100 },
      courses: [{ courseId: "c1", percentage: 100 }]
    });

    expect(Certificate.create).not.toHaveBeenCalled();
    expect(generateCertificate).not.toHaveBeenCalled();
    expect(sendCertificateEmail).not.toHaveBeenCalled();
  });

  it("skips certificate flow when global percentage is below 100", async () => {
    await handleCertificate("u1", {
      global: { percentage: 85 },
      courses: [{ courseId: "c1", percentage: 100 }]
    });

    expect(User.findById).not.toHaveBeenCalled();
    expect(Certificate.findOne).not.toHaveBeenCalled();
    expect(Certificate.create).not.toHaveBeenCalled();
  });

  it("uses BREVO_TEST_TO fallback when user email is missing", async () => {
    process.env.BREVO_TEST_TO = "fallback@test.com";

    User.findById.mockReturnValue(lean({ _id: "u1", fullName: "Pranav" }));
    Course.findById.mockReturnValue(lean({ _id: "c1", title: "AI Basics" }));
    Certificate.findOne.mockReturnValue(lean(null));
    generateCertificate.mockResolvedValue("/tmp/c1.pdf");
    sendCertificateEmail.mockResolvedValue(true);

    await handleCertificate("u1", {
      global: { percentage: 100 },
      courses: [{ courseId: "c1", percentage: 100 }]
    });

    expect(sendCertificateEmail).toHaveBeenCalledWith({
      to: "fallback@test.com",
      filePath: "/tmp/c1.pdf"
    });
  });
});
