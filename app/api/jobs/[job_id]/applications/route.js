import { connect } from "@/utils/db";
import Jobs from "@/models/Jobs";
import User from "@/models/User";
import Fprofile from "@/models/Fprofile";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        await connect();
        const { job_id } = await params;

        const job = await Jobs.findById(job_id);

        if (!job) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        // Fetch user details for each application
        const applicationsWithDetails = await Promise.all(
            job.applications.map(async (app) => {
                try {
                    const user = await User.findById(app.userId).select('name email');
                    const fprofile = await Fprofile.findOne({ user: app.userId }).select('skills bio');

                    return {
                        userId: app.userId,
                        proposal: app.proposal,
                        appliedAt: app._id?.getTimestamp() || new Date(),
                        userName: user?.name || "Unknown User",
                        userEmail: user?.email || "",
                        userSkills: fprofile?.skills || [],
                        userBio: fprofile?.bio || ""
                    };
                } catch (error) {
                    console.error(`Error fetching user details for ${app.userId}:`, error);
                    return {
                        userId: app.userId,
                        proposal: app.proposal,
                        appliedAt: app._id?.getTimestamp() || new Date(),
                        userName: "Unknown User",
                        userEmail: "",
                        userSkills: [],
                        userBio: ""
                    };
                }
            })
        );

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
