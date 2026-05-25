// GET /api/jobs/search?q=frontend
import { connect } from "@/utils/db";
import Job from "@/models/Jobs";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    const jobs = await Job.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { skills: { $regex: query, $options: "i" } },
      ],
    });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}