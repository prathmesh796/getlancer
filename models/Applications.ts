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
        jobName: {
            type: String,
            required: true,
        },
        freelancerName: {
            type: String,
            required: true,
        },
        freelancerEmail: {
            type: String,
            required: true,
        },
        freelancerProfileUrl: {
            type: String,
            required: true,
        },
        proposal: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "assigned", "rejected", "revoked", "hold"],
            default: "pending",
        }
    },
    { timestamps: true }
)

const Applications = mongoose.models.Applications || mongoose.model("Applications", applicationsSchema)

export default Applications as mongoose.Model<Application>