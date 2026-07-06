import mongoose from "mongoose";
import type {CprofileType} from "@/types/User"

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
    description: {
      type: String,
      default: ""
    },
    logo: {
      type: Object,
      default: {
        name: "",
        url: "",
        type: "",
        key: "" 
      }
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
  }, {timestamps: true}
)

const Cprofile = mongoose.models.Cprofile || mongoose.model("Cprofile", CprofileSchema);

export default Cprofile as mongoose.Model<CprofileType>