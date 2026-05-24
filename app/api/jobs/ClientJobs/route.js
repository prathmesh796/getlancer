import { connect } from "@/utils/db";
import Cprofile from "@/models/Cprofile";
import Jobs from "@/models/Jobs";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connect();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const clientProfile = await Cprofile.findOne({ user: userId });

    if (!clientProfile) {
      return NextResponse.json({ success: false, error: "Client profile not found" }, { status: 404 });
    }

    const ClientJobs = await Jobs.find({ _id: { $in: clientProfile.postedJobs } });

    return NextResponse.json({ success: true, ClientJobs }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}