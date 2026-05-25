import { connect } from '@/utils/db'
import Jobs from '@/models/Jobs'
import Cprofile from '@/models/Cprofile'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        await connect();

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit")) || 20;
        const skip = parseInt(searchParams.get("skip")) || 0;
        const status = searchParams.get("status");

        const query = status ? { status } : {};

        const jobs = await Jobs.find(query)
            .sort({ datePosted: -1 }) // newest first
            .skip(skip)
            .limit(limit);

        const total = await Jobs.countDocuments(query);

        return NextResponse.json({
            success: true,
            jobs,
            total,
            hasMore: skip + jobs.length < total
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        let conn = await connect()
        const body = await request.json()
        const { jobTitle, jobDescription, bounty, location, skills, company, userId } = body;

        const newJob = new Jobs({
            title: jobTitle,
            description: jobDescription,
            company: company,
            location: location,
            bounty: bounty,
            skills: skills,
        });

        const savedJob = await newJob.save()

        const updatedProfile = await Cprofile.findOneAndUpdate(
            { user: userId },
            { $push: { postedJobs: savedJob._id } },
            { new: true }
        )

        return NextResponse.json({ message: "New Job created successfully", job: savedJob, success: true }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}