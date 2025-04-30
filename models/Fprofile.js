import mongoose from "mongoose";

const FprofileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ""
  },
  skills: {
    type: [String],
    default: []
  },
  hourlyRate: {
    type: Number,
    default: 0
  },
  experience: {
    type: [Object],
    default: []
  },
  location: {
    type: String,
    default: ""
  },
  profilePic: {
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
  projects: {
    type: [Object],
    default: []
  },
  Jobs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Job",
    default: []
  },
});

export default mongoose.models.Fprofile || mongoose.model("Fprofile", FprofileSchema);