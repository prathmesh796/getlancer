import { connect } from "@/utils/db";
import { NextResponse } from "next/server";
import Fprofile from "@/models/Fprofile";

export async function GET(req) {
    await connect();

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
        }

        const freelancerProfile = await Fprofile.findOne({ userId });

        if (!freelancerProfile) {
            return NextResponse.json({ success: false, error: "Freelancer profile not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, freelancerProfile });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function POST(req) {
    await connect();

    try {
        const body = await req.json();
        const { userId, title, skills, bio, hourlyRate, experience, location, profilePic, socialLinks, projects } = body;

        const updated = await Fprofile.findOneAndUpdate(
            { userId },
            { title, bio, skills, hourlyRate, experience, location, profilePic, socialLinks, projects},
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, updated });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}