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
  Links: {
    type: [String],
    default: []
  },
  experience: {
    type: [Object],
    default: []
  },
  location: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Fprofile || mongoose.model("Fprofile", FprofileSchema);