// GET /api/jobs/recommendations
import { connect } from "@/utils/db";
import Job from "@/models/Jobs";
import FreelancerProfile from "@/models/Fprofile";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = parseInt(searchParams.get("skip")) || 0;

    // 2. Fetch freelancer profile
    const freelancer = await FreelancerProfile.findOne({
      userId: session.user.id,
    });

    // 3. Fetch active jobs
    const jobs = await Job.find({
      status: "open",
    }).sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // 4. Calculate score
    const recommendations = jobs.map((job) => {
      const matchingSkills = job.skills.filter((skill) =>
        freelancer.skills
          .map((s) => s.toLowerCase())
          .includes(skill.toLowerCase())
      );

      const skillScore =
        job.skills.length > 0
          ? matchingSkills.length / job.skills.length
          : 0;

      const score =
        skillScore * 0.8

      return {
        job,
        score,
        matchingSkills,
      };
    });

    // 5. Sort highest score first
    recommendations.sort((a, b) => b.score - a.score);

    return NextResponse.json(recommendations.slice(0, 10));
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}