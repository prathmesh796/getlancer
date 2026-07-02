import mongoose from "mongoose";
import type { Application } from "@/types/Jobs"

const applicationsSchema = new mongoose.Schema(
    {
        freelancerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Jobs",
            required: true,
        },
        proposal: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
        datePosted: {
            type: Date,
            default: Date.now,
        }
    },
    { timestamps: true }
)

const Applications = mongoose.models.Applications || mongoose.model("Applications", applicationsSchema)

export default Applications as mongoose.Model<Application>