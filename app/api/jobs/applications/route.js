import { connect } from "@/utils/db";
import Jobs from "@/models/Jobs";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connect();

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Find all jobs where the user has applied
        const appliedJobs = await Jobs.find({
            "applications.userId": userId
        }).sort({ datePosted: -1 });

        // Map the jobs to include the user's specific application
        const jobsWithApplications = appliedJobs.map(job => {
            const userApplication = job.applications.find(
                app => app.userId.toString() === userId
            );

            return {
                _id: job._id,
                title: job.title,
                description: job.description,
                company: job.company,
                location: job.location,
                bounty: job.bounty,
                datePosted: job.datePosted,
                skills: job.skills,
                status: job.status,
                myProposal: userApplication?.proposal || "",
                appliedAt: userApplication?._id?.getTimestamp() || job.datePosted
            };
        });

        return NextResponse.json({
            applications: jobsWithApplications,
            success: true
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching applications:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
