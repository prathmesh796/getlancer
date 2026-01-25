import { connect } from "@/utils/db";
import Jobs from "@/models/Jobs";
import Cprofile from "@/models/Cprofile";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        await connect();

        const job = await Jobs.findById(params.job_id);

        if (!job) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        return NextResponse.json({ job, success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await connect();

        const body = await request.json();
        const { user, proposal } = body;

        if (!user?.id || !proposal) {
            return NextResponse.json({ error: "Missing user or proposal" }, { status: 400 });
        }

        const updatedJob = await Jobs.findByIdAndUpdate(
            params.job_id,
            {
                $push: {
                    applications: {
                        userId: user.id,
                        proposal,
                    },
                },
            },
            { new: true }
        );

        if (!updatedJob) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        return NextResponse.json({ job: updatedJob, success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
        await connect();

        const body = await request.json();
        const { status, userId } = body;

        if (!status || !userId) {
            return NextResponse.json({ error: "Missing status or userId" }, { status: 400 });
        }

        // Verify the user owns this job
        const job = await Jobs.findById(params.job_id);
        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        const clientProfile = await Cprofile.findOne({ user: userId });
        if (!clientProfile || !clientProfile.postedJobs.includes(params.job_id)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const updatedJob = await Jobs.findByIdAndUpdate(
            params.job_id,
            { status },
            { new: true }
        );

        return NextResponse.json({ job: updatedJob, success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await connect();

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Verify the user owns this job
        const clientProfile = await Cprofile.findOne({ user: userId });
        if (!clientProfile || !clientProfile.postedJobs.includes(params.job_id)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const deletedJob = await Jobs.findByIdAndDelete(params.job_id);

        if (!deletedJob) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        // Remove job from client's postedJobs array
        await Cprofile.findOneAndUpdate(
            { user: userId },
            { $pull: { postedJobs: params.job_id } }
        );

        return NextResponse.json({
            message: "Job deleted successfully",
            job: deletedJob,
            success: true
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}