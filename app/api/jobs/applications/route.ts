import { connect } from "@/utils/db";
import Jobs from "@/models/Jobs";
import { NextResponse, NextRequest } from "next/server";
import type { Job, Application } from "@/types/Jobs";

export async function GET(request: NextRequest) {
    try {
        await connect();

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Find all jobs where the user has applied
        const appliedJobs: Job[] = await Jobs.find({
            "applications.freelancerId": userId
        }).sort({ datePosted: -1 });

        // Map the jobs to include the user's specific application
        const jobsWithApplications = appliedJobs.map((job: Job) => {
            const userApplication = job.applications.find(
                (app: Application) => app.freelancerId.toString() === userId
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
                appliedAt: userApplication?.appliedAt
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
