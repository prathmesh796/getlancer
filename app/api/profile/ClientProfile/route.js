import { connect } from "@/utils/db";
import Client from "@/models/Cprofile";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connect();

  try {
    const userId = req.data.userId;

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const clientProfile = await Client.findOne({ userId });

    if (!clientProfile) {
      return NextResponse.json({ success: false, error: "Client profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, clientProfile });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  await connect();

  try {
    const formData = await req.formData();

    const userId = formData.get("userId");
    const companyName = formData.get("companyName");
    const website = formData.get("website");
    const bio = formData.get("bio");
    const location = formData.get("location");
    const socialLinksJSON = formData.get("socialLinks");
    const logo = formData.get("logo"); // File object

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const updateFields = {
      companyName,
      website,
      bio,
      location,
    };

    if (socialLinksJSON) {
      updateFields.socialLinks = JSON.parse(socialLinksJSON);
    }

    if (logo && typeof logo === "object" && logo.name) {
      const bytes = await logo.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(process.cwd(), "public", "uploads", logo.name);
      await writeFile(filePath, buffer);

      updateFields.logo = {
        name: logo.name,
        type: logo.type,
        url: `/uploads/${logo.name}`,
      };
    }

    const updatedProfile = await Client.findOneAndUpdate(
      { user: userId },
      { $set: updateFields },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}