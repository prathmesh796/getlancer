import { GET } from "../app/api/jobs/recommendations/route";
import { connect } from "@/utils/db";
import Job from "@/models/Jobs";
import FreelancerProfile from "@/models/Fprofile";
import { getServerSession } from "next-auth";

jest.mock("@/utils/db", () => ({
  connect: jest.fn(),
}));

jest.mock("@/models/Jobs");
jest.mock("@/models/Fprofile");

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
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

describe("api/jobs/recommendations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 if unauthorized", async () => {
    getServerSession.mockResolvedValue(null);
    const request = { url: "http://localhost:3000/api/jobs/recommendations" };
    const response = await GET(request);
    
    const data = await response.json();
    expect(data.error).toBe("Unauthorized");
    expect(response.status).toBe(401);
  });

  it("returns job recommendations sorted by score", async () => {
    getServerSession.mockResolvedValue({ user: { id: "user1" } });
    
    FreelancerProfile.findOne.mockResolvedValue({
      userId: "user1",
      skills: ["React", "Node.js"],
    });

    const mockJobs = [
      { _id: "job1", skills: ["Python"] },
      { _id: "job2", skills: ["React", "Node.js"] }, // 100% match
      { _id: "job3", skills: ["React", "Vue"] },     // 50% match
    ];

    Job.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockJobs),
    });

    const request = { url: "http://localhost:3000/api/jobs/recommendations" };
    const response = await GET(request);
    const data = await response.json();

    expect(data).toHaveLength(3);
    
    // Highest score first (job2)
    expect(data[0].job._id).toBe("job2");
    expect(data[0].score).toBeCloseTo(0.8); // 2/2 * 0.8
    expect(data[0].matchingSkills).toEqual(["React", "Node.js"]);

    // Second highest (job3)
    expect(data[1].job._id).toBe("job3");
    expect(data[1].score).toBeCloseTo(0.4); // 1/2 * 0.8
    expect(data[1].matchingSkills).toEqual(["React"]);

    // Lowest score (job1)
    expect(data[2].job._id).toBe("job1");
    expect(data[2].score).toBe(0); // 0/1 * 0.8
    expect(data[2].matchingSkills).toEqual([]);
    
    expect(response.status).toBe(200);
  });

  it("handles errors gracefully", async () => {
    getServerSession.mockResolvedValue({ user: { id: "user1" } });
    FreelancerProfile.findOne.mockRejectedValue(new Error("DB Error"));

    const request = { url: "http://localhost:3000/api/jobs/recommendations" };
    const response = await GET(request);
    const data = await response.json();

    expect(data.error).toBe("DB Error");
    expect(response.status).toBe(500);
  });
});
