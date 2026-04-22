import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/models/Course.js", () => ({
  default: { find: vi.fn() }
}));

vi.mock("../src/models/Module.js", () => ({
  default: { find: vi.fn() }
}));

vi.mock("../src/models/Content.js", () => ({
  default: { find: vi.fn() }
}));

vi.mock("../src/models/Progress.js", () => ({
  default: { find: vi.fn() }
}));

vi.mock("../src/services/certificate.service.js", () => ({
  handleCertificate: vi.fn()
}));

import Course from "../src/models/Course.js";
import Module from "../src/models/Module.js";
import Content from "../src/models/Content.js";
import Progress from "../src/models/Progress.js";
import { handleCertificate } from "../src/services/certificate.service.js";
import { getDashboardData } from "../src/services/dashboard.service.js";

const lean = (value) => ({ lean: vi.fn().mockResolvedValue(value) });

describe("dashboard -> certificate trigger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    handleCertificate.mockResolvedValue(undefined);
  });

  it("triggers certificate handling when computed progress reaches 100%", async () => {
    Course.find.mockReturnValue(lean([{ _id: "c1", title: "AI Foundations" }]));
    Module.find.mockReturnValue(lean([{ _id: "m1", title: "Module 1", courseId: "c1" }]));

    // dashboard.service uses Content.find().lean()
    Content.find.mockReturnValue(
      lean([
        { _id: "ct1", moduleId: "m1" },
        { _id: "ct2", moduleId: "m1" }
      ])
    );

    // dashboard.service uses Progress.find({ userId, completed: true }).lean()
    Progress.find.mockReturnValue(
      lean([
        { _id: "p1", userId: "u1", contentId: "ct1", completed: true },
        { _id: "p2", userId: "u1", contentId: "ct2", completed: true }
      ])
    );

    const dashboardData = await getDashboardData("u1");

    expect(dashboardData.global.percentage).toBe(100);

    const firstCourse = dashboardData.courses?.[0] || {};
    const coursePercentage =
      firstCourse.percentage ??
      firstCourse.progressPercentage ??
      firstCourse.progress?.percentage ??
      (typeof firstCourse.completed === "number" && typeof firstCourse.total === "number" && firstCourse.total > 0
        ? Math.round((firstCourse.completed / firstCourse.total) * 100)
        : undefined);

    expect(coursePercentage).toBe(100);

    await new Promise((r) => setTimeout(r, 0));

    expect(handleCertificate).toHaveBeenCalledTimes(1);
    expect(handleCertificate).toHaveBeenCalledWith(
      "u1",
      expect.objectContaining({
        global: expect.objectContaining({ percentage: 100 })
      })
    );
  });
});
