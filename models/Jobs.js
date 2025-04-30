import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        company: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        salary: {
            type: Number,
            required: true,
        },
        datePosted: {
            type: Date,
            default: Date.now,
        },
        skills: {
            type: [String],
            required: true,
        },
    }
)

const Jobs = mongoose.models.Jobs || mongoose.model("Jobs", jobsSchema)

export default Jobs