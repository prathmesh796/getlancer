import { connect } from "@/utils/db";
import Applications from "@/models/Applications";
import Jobs from "@/models/Jobs";
import { NextResponse, NextRequest } from "next/server";
import type { Application } from "@/types/Jobs";

//fetch by job id or freelancerId
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");
    const freelancerId = searchParams.get("freelancerId");

    try {
        await connect()

        let applications: Application[];

        if (jobId) {
            applications = await Applications.find({
                jobId: jobId
            })
        } else if (freelancerId) {
            applications = await Applications.find({
                freelancerId: freelancerId
            })
        }

        return NextResponse.json({ applications })
    } catch (err) {
        console.log("Error fetching applications:", err)
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    try {
        await connect();

        const body = await req.json();
        const { user, proposal } = body;

        if (!user?.id || !proposal) {
            return NextResponse.json({ error: "Missing user or proposal" }, { status: 400 });
        }

        const postApplication = {
            jobId: jobId,
            freelancerId: user.id,
            freelancerName: user.name || "Unknown",
            freelancerEmail: user.email || "",
            freelancerProfileUrl: user.image || "/profilepic.jpeg",
            proposal: proposal,
        }

        const result = await Applications.create(postApplication);

        if (!result) {
            return NextResponse.json({ error: "Application not posted" }, { status: 404 });
        }

        return NextResponse.json({ application: result, success: true }, { status: 200 });
    } catch (error: any) {
        console.error("Error creating application:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connect();

        const { searchParams } = new URL(req.url);
        const appId = searchParams.get("appId");

        if (!appId) {
            return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
        }

        const body = await req.json();
        const { status } = body;

        const result = await Applications.findByIdAndUpdate(
            appId,
            { status }
        );

        if (status === "assigned") {
            const updateJob = await Jobs.findByIdAndUpdate(result.jobId, { status: "assigned", assignedTo: result.freelancerId });

            const updateOtherApplications = await Applications.updateMany(
                { jobId: result.jobId, status: "pending" },
                { status: "hold" }
            );
        } else if (status === "revoked") {
            const updateJob = await Jobs.findByIdAndUpdate(result.jobId, { status: "open", assignedTo: null });

            const updateOtherApplications = await Applications.updateMany(
                { jobId: result.jobId, status: "hold" },
                { status: "pending" }
            );
        }

        if (!result) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        return NextResponse.json({ application: result, success: true }, { status: 200 });
    } catch (error) {
        console.log("Error updating application:", error);
        return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
    }
}