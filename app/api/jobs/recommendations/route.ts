// GET /api/jobs/recommendations
import { connect } from "@/utils/db";
import Jobs from "@/models/Jobs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();

    const jobs = await Jobs.find()
      .sort({ datePosted: -1 }) // newest first
      .limit(5);

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}