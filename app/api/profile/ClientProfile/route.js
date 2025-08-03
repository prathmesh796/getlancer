import { connect } from "@/utils/db";
import Cprofile from "@/models/Cprofile";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function GET(req) {
  await connect();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const clientProfile = await Cprofile.findOne({ user: userId });
    console.log("profile found")

    if (!clientProfile) {
      return NextResponse.json({ success: false, error: "Client profile not found" }, { status: 404 });
    }

    if (clientProfile.logo?.key) {
      const command = new GetObjectCommand({
        Bucket: "getlancer",
        Key: clientProfile.logo.key,
      });

      const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });
      clientProfile.logo.url = signedUrl;
    }

    return NextResponse.json({ success: true, clientProfile }, { status: 200 });
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
    if (socialLinksJSON) {
      try {
        JSON.parse(socialLinksJSON);
      } catch (e) {
        return NextResponse.json({ success: false, error: "Invalid social links format" }, { status: 400 });
      }
    }
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
    console.log("Update Fields:", updateFields);

    if (logo && typeof logo === "object") {
      const bytes = await logo.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${userId}-${Date.now()}-${logo.name}`;
      const bucketName = "getlancer";

      await r2.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          Body: buffer,
          ContentType: logo.type,
        })
      );
      console.log(`File uploaded successfully: ${fileName}`);

      // Store the R2 URL or key in your DB
      updateFields.logo = {
        url: `${process.env.R2_ENDPOINT}/${fileName}`,
        key: fileName,
      };
      console.log("Logo updated:", updateFields.logo);
    }

    const updatedProfile = await Cprofile.findOneAndUpdate(
      { user: userId },
      { $set: updateFields },
      { new: true, upsert: true }
    );
    console.log("Updated Profile:", updatedProfile);

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}