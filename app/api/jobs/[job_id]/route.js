import { connect } from "@/utils/db";
import Jobs from "@/models/Jobs";
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