import { GET, POST } from "../app/api/jobs/route";
import { connect } from "@/utils/db";
import Jobs from "@/models/Jobs";
import Cprofile from "@/models/Cprofile";
import { NextResponse } from "next/server";

// Mock MongoDB/Mongoose database connection and models
jest.mock("@/utils/db", () => ({
  connect: jest.fn(),
}));

jest.mock("@/models/Jobs");
jest.mock("@/models/Cprofile");

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      json: async () => body,
      status: init?.status || 200,
    })),
  },
}));

describe("api/jobs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("returns jobs and total count successfully with pagination", async () => {
      const mockJobs = [{ title: "Developer" }, { title: "Designer" }];
      const mockCount = 2;

      Jobs.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockJobs),
      });
      Jobs.countDocuments.mockResolvedValue(mockCount);

      const request = {
        url: "http://localhost:3000/api/jobs?limit=5&skip=0&status=active",
      };

      const response = await GET(request);
      const data = await response.json();

      expect(connect).toHaveBeenCalled();
      expect(Jobs.find).toHaveBeenCalledWith({ status: "active" });
      expect(data.success).toBe(true);
      expect(data.jobs).toEqual(mockJobs);
      expect(data.total).toBe(mockCount);
      expect(data.hasMore).toBe(false);
      expect(response.status).toBe(200);
    });

    it("handles errors and returns a 500 status", async () => {
      Jobs.find.mockImplementation(() => {
        throw new Error("DB Error");
      });

      const request = {
        url: "http://localhost:3000/api/jobs",
      };

      const response = await GET(request);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toBe("DB Error");
      expect(response.status).toBe(500);
    });
  });

  describe("POST", () => {
    it("creates a new job and updates client profile", async () => {
      const mockJobPayload = {
        jobTitle: "React Developer",
        jobDescription: "Description text",
        company: "Google",
        location: "Remote",
        bounty: 2000,
        skills: ["React", "Jest"],
        userId: "user-123",
      };

      const mockSavedJob = {
        _id: "job-abc",
        title: "React Developer",
        description: "Description text",
        company: "Google",
        location: "Remote",
        bounty: 2000,
        skills: ["React", "Jest"],
      };

      // Mock save operation
      Jobs.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockSavedJob),
      }));

      // Mock profile update
      Cprofile.findOneAndUpdate.mockResolvedValue({
        _id: "profile-123",
        postedJobs: ["job-abc"],
      });

      const request = {
        json: async () => mockJobPayload,
      };

      const response = await POST(request);
      const data = await response.json();

      expect(connect).toHaveBeenCalled();
      expect(Cprofile.findOneAndUpdate).toHaveBeenCalledWith(
        { user: "user-123" },
        { $push: { postedJobs: "job-abc" } },
        { new: true }
      );
      expect(data.success).toBe(true);
      expect(data.message).toBe("New Job created successfully");
      expect(data.job).toEqual(mockSavedJob);
      expect(response.status).toBe(200);
    });

    it("handles POST error scenarios gracefully", async () => {
      const request = {
        json: async () => {
          throw new Error("Invalid Body");
        },
      };

      const response = await POST(request);
      const data = await response.json();

      expect(data.error).toBe("Invalid Body");
      expect(response.status).toBe(500);
    });
  });
});
