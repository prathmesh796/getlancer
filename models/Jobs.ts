import mongoose from "mongoose";
import type { Job } from "@/types/Jobs"

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
        bounty: {
            type: Number,
            required: true,
        },
        skills: {
            type: [String],
            required: true,
        },
        applications: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Applications",
            default: [],
        },
        status: {
            type: String,
            enum: ["open", "assigned", "closed"],
            default: "open",
        },
    }, {timestamps: true}
)

const Jobs = mongoose.models.Jobs || mongoose.model("Jobs", jobsSchema)

export default Jobs as mongoose.Model<Job>