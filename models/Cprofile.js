import mongoose from "mongoose";

const CprofileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    companyName: {
      type: String,
      default: ""
    },
    website: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    },
    bio: {
      type: String,
      default: ""
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    logo: {
      type: Object,
    },
    socialLinks: {
      type: Object,
      default: {
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
        github: ""
      }
    },
    postedJobs: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Jobs",
      default: []
    },
  }
)

const Cprofile = mongoose.models.User || mongoose.model("Cprofile", CprofileSchema)

export default Cprofile