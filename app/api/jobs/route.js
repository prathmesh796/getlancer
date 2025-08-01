import { connect } from '@/utils/db'
import Jobs from '@/models/Jobs'
import Cprofile from '@/models/Cprofile'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        let conn = await connect()
        const body = await request.json()
        const { jobTitle, jobDescription, budget, location, skills, company, userId } = body;

        const newJob = new Jobs({
            title: jobTitle,
            description: jobDescription,
            company,
            location,
            salary: budget,
            skills,
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