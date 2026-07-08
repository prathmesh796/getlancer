import { GET, POST, PUT } from "../app/api/applications/route";
import { connect } from "@/utils/db";
import Applications from "@/models/Applications";
import Jobs from "@/models/Jobs";
import nodemailer from "nodemailer";

jest.mock("@/utils/db", () => ({
  connect: jest.fn(),
}));

jest.mock("@/models/Applications");
jest.mock("@/models/Jobs");

jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(true),
  }),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      json: async () => body,
      status: init?.status || 200,
    })),
  },
  NextRequest: jest.fn(),
}));

describe("api/applications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("returns applications by jobId successfully", async () => {
      const mockApps = [{ 
        _id: "app1", 
        jobId: { _id: "job1", title: "Test Job" },
        freelancerId: { _id: "free1", name: "John Doe", email: "john@example.com" }
      }];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockApps),
      };
      Applications.find.mockReturnValue(mockQuery);

      const request = {
        url: "http://localhost:3000/api/applications?jobId=job1",
      };

      const response = await GET(request);
      const data = await response.json();

      const expectedApps = [{
        _id: "app1",
        jobId: "job1",
        jobName: "Test Job",
        freelancerId: "free1",
        freelancerName: "John Doe",
        freelancerEmail: "john@example.com",
      }];

      expect(connect).toHaveBeenCalled();
      expect(Applications.find).toHaveBeenCalledWith({ jobId: "job1" });
      expect(data.applications).toEqual(expectedApps);
      expect(response.status).toBe(200);
    });

    it("returns applications by freelancerId successfully", async () => {
      const mockApps = [{ 
        _id: "app1", 
        jobId: { _id: "job2", title: "Another Job" },
        freelancerId: { _id: "free1", name: "John Doe", email: "john@example.com" }
      }];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockApps),
      };
      Applications.find.mockReturnValue(mockQuery);

      const request = {
        url: "http://localhost:3000/api/applications?freelancerId=free1",
      };

      const response = await GET(request);
      const data = await response.json();

      const expectedApps = [{
        _id: "app1",
        jobId: "job2",
        jobName: "Another Job",
        freelancerId: "free1",
        freelancerName: "John Doe",
        freelancerEmail: "john@example.com",
      }];

      expect(connect).toHaveBeenCalled();
      expect(Applications.find).toHaveBeenCalledWith({ freelancerId: "free1" });
      expect(data.applications).toEqual(expectedApps);
      expect(response.status).toBe(200);
    });

    it("handles errors and returns 500 status", async () => {
      Applications.find.mockImplementation(() => { throw new Error("DB Error") });

      const request = {
        url: "http://localhost:3000/api/applications?jobId=job1",
      };

      const response = await GET(request);
      const data = await response.json();

      expect(data.error).toBe("Failed to fetch applications");
      expect(response.status).toBe(500);
    });
  });

  describe("POST", () => {
    it("creates a new application successfully", async () => {
      const mockBody = {
        user: { id: "free1" },
        proposal: "I want this job",
      };
      
      const mockSavedApp = {
        _id: "app1",
        jobId: "job1",
        freelancerId: "free1",
        proposal: "I want this job",
      };

      Applications.create.mockResolvedValue(mockSavedApp);

      const request = {
        url: "http://localhost:3000/api/applications?jobId=job1",
        json: async () => mockBody,
      };

      const response = await POST(request);
      const data = await response.json();

      expect(connect).toHaveBeenCalled();
      expect(Applications.create).toHaveBeenCalledWith({
        jobId: "job1",
        freelancerId: "free1",
        proposal: "I want this job",
      });
      expect(data.success).toBe(true);
      expect(data.application).toEqual(mockSavedApp);
      expect(response.status).toBe(200);
    });

    it("returns 400 when missing fields", async () => {
      const mockBody = {
        user: { id: "free1" },
        // missing jobName and proposal
      };

      const request = {
        url: "http://localhost:3000/api/applications?jobId=job1",
        json: async () => mockBody,
      };

      const response = await POST(request);
      const data = await response.json();

      expect(data.error).toBe("Missing user or proposal or jobname");
      expect(response.status).toBe(400);
    });
  });

  describe("PUT", () => {
    it("updates application status to assigned, updates job, updates other applications, and sends email", async () => {
      const mockUpdatedApp = {
        _id: "app1",
        jobId: "job1",
        freelancerId: "free1",
        status: "assigned",
      };

      Applications.findByIdAndUpdate.mockResolvedValue(mockUpdatedApp);
      Jobs.findByIdAndUpdate.mockResolvedValue(true);
      Applications.updateMany.mockResolvedValue(true);

      const request = {
        url: "http://localhost:3000/api/applications?appId=app1",
        json: async () => ({ status: "assigned" }),
      };

      const response = await PUT(request);
      const data = await response.json();

      expect(Applications.findByIdAndUpdate).toHaveBeenCalledWith("app1", { status: "assigned" });
      expect(Jobs.findByIdAndUpdate).toHaveBeenCalledWith("job1", { status: "assigned", assignedTo: "free1" });
      expect(Applications.updateMany).toHaveBeenCalledWith({ jobId: "job1", status: "pending" }, { status: "hold" });
      expect(nodemailer.createTransport).toHaveBeenCalled();
      expect(data.success).toBe(true);
      expect(data.application).toEqual(mockUpdatedApp);
      expect(response.status).toBe(200);
    });

    it("updates application status to revoked, updates job, updates other applications, and sends email", async () => {
      const mockUpdatedApp = {
        _id: "app1",
        jobId: "job1",
        freelancerId: "free1",
        status: "revoked",
      };

      Applications.findByIdAndUpdate.mockResolvedValue(mockUpdatedApp);
      Jobs.findByIdAndUpdate.mockResolvedValue(true);
      Applications.updateMany.mockResolvedValue(true);

      const request = {
        url: "http://localhost:3000/api/applications?appId=app1",
        json: async () => ({ status: "revoked" }),
      };

      const response = await PUT(request);
      const data = await response.json();

      expect(Applications.findByIdAndUpdate).toHaveBeenCalledWith("app1", { status: "revoked" });
      expect(Jobs.findByIdAndUpdate).toHaveBeenCalledWith("job1", { status: "open", assignedTo: null });
      expect(Applications.updateMany).toHaveBeenCalledWith({ jobId: "job1", status: "hold" }, { status: "pending" });
      expect(data.success).toBe(true);
    });

    it("returns 400 if appId is missing", async () => {
      const request = {
        url: "http://localhost:3000/api/applications",
        json: async () => ({ status: "assigned" }),
      };

      const response = await PUT(request);
      const data = await response.json();

      expect(data.error).toBe("Application ID is required");
      expect(response.status).toBe(400);
    });
  });
});
