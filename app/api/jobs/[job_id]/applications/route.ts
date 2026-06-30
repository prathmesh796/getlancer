import { connect } from "@/utils/db";
import Jobs from "@/models/Jobs";
import User from "@/models/User";
import Fprofile from "@/models/Fprofile";
import { NextResponse, NextRequest } from "next/server";
import type { Job, application } from "@/types/Jobs";

export async function GET(request: NextRequest, { params }){
    try {
        await connect();
        const { job_id } = params;

        const job: Job = await Jobs.findById(job_id);

        if (!job) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        // Fetch user details for each application
        const applicationsWithDetails = await Promise.all(
            job.applications.map(async (app: application) => {
                try {
                    const user = await User.findById(app.freelancerId).select('name email');
                    const fprofile = await Fprofile.findOne({ user: app.freelancerId }).select('skills bio');

                    return {
                        userId: app.freelancerId,
                        proposal: app.proposal,
                        appliedAt: app.appliedAt,
                        userName: user?.name || "Unknown User",
                        userEmail: user?.email || "",
                        userSkills: fprofile?.skills || [],
                        userBio: fprofile?.bio || ""
                    };
                } catch (error) {
                    console.error(`Error fetching user details for ${app.freelancerId}:`, error);
                    return {
                        userId: app.freelancerId,
                        proposal: app.proposal,
                        appliedAt: app.appliedAt,
                        userName: "Unknown User",
                        userEmail: "",
                        userSkills: [],
                        userBio: ""
                    };
                }
            })
        );

        console.log("applicationsWithDetails", applicationsWithDetails)

        return NextResponse.json({
            applications: applicationsWithDetails,
            jobTitle: job.title,
            success: true
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching job applications:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
