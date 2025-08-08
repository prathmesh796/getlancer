import { connect } from '@/utils/db'
import Jobs from '@/models/Jobs'
import Cprofile from '@/models/Cprofile'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        let conn = await connect()
        const body = await request.json()
        const { jobTitle, jobDescription, bounty, location, skills, company, userId } = body;
        console.log("Received job data:", body);

        const newJob = new Jobs({
            title: jobTitle,
            description: jobDescription,
            company: company,
            location: location,
            bounty: bounty,
            skills: skills,
        });

        const savedJob = await newJob.save()
        console.log("Job saved successfully:", savedJob);

        const updatedProfile = await Cprofile.findOneAndUpdate(
            { user: userId },
            { $push: { postedJobs: savedJob._id } },
            { new: true }
        )
        console.log("Client profile updated with new job:", updatedProfile);

        return NextResponse.json({ message: "New Job created successfully", job: savedJob, success: true }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}