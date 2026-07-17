import { connect } from "@/utils/db";
import Cprofile from "@/models/Cprofile";
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { CprofileType } from "@/types/User";
import User from "@/models/User";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function GET(req: NextRequest) {
  await connect();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const user = await User.findOne({ _id: userId })
    const profile = await Cprofile.findOne({ user: userId });

    if (!profile) {
      return NextResponse.json({ success: false, error: "Client profile not found" }, { status: 404 });
    }

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (profile.logo?.key) {
      const command = new GetObjectCommand({
        Bucket: "getlancer",
        Key: profile.logo.key,
      });

      const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });
      profile.logo.url = signedUrl;
    }

    return NextResponse.json({ success: true, user, profile }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await connect();

  try {
    const formData = await req.formData();

    const userId = formData.get("userId");
    const companyName = formData.get("companyName");
    const website = formData.get("website");
    const bio = formData.get("bio");
    const description = formData.get("description");
    const location = formData.get("location");
    const socialLinksJSON = formData.get("socialLinks");
    const logo = formData.get("logo");

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const updateFields: Partial<CprofileType> = {
      companyName: companyName?.toString(),
      website: website?.toString(),
      bio: bio?.toString(),
      description: description?.toString(),
      location: location?.toString(),
      socialLinks: JSON.parse(socialLinksJSON as string),
      logo: JSON.parse(logo as string)
    };

    const existingProfile = await Cprofile.findOne({ user: userId });

    if (logo && typeof logo === "object") {
      if (existingProfile?.logo?.key) {
        try {
          await r2.send(
            new DeleteObjectCommand({
              Bucket: "getlancer",
              Key: existingProfile.logo.key,
            })
          );
        } catch (err) {
          console.warn("Failed to delete old logo:", err.message);
        }
      }

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

      // Store the R2 URL or key in your DB
      updateFields.logo = {
        url: `${process.env.R2_ENDPOINT}/${fileName}`,
        key: fileName,
        type: logo.type,
        name: logo.name
      };
    }

    const updatedProfile = await Cprofile.findOneAndUpdate(
      { user: userId },
      { $set: updateFields },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  await connect();

  try {
    const contentType = req.headers.get("content-type") || "";
    let userId: string | null = null;
    let updateFields: any = {};

    if (contentType.includes("application/json")) {
        const body = await req.json();
        userId = body.userId;
        if (body.updateFields) {
            updateFields = body.updateFields;
        } else {
            const { name, companyName, bio, location, website } = body;
            if (name) updateFields.name = name;
            if (companyName) updateFields.companyName = companyName;
            if (bio) updateFields.bio = bio;
            if (location) updateFields.location = location;
            if (website) updateFields.website = website;
        }
    } else {
        const formData = await req.formData();
        userId = formData.get("userId") as string | null;

        const name = formData.get("name") as string | null;
        const companyName = formData.get("companyName") as string | null;
        const bio = formData.get("bio") as string | null;
        const location = formData.get("location") as string | null;
        const website = formData.get("website") as string | null;

        if (name) updateFields.name = name;
        if (companyName) updateFields.companyName = companyName;
        if (bio) updateFields.bio = bio;
        if (location) updateFields.location = location;
        if (website) updateFields.website = website;

        const existingProfile = await Cprofile.findOne({ user: userId });

        const logo = formData.get("logo");
        if (logo && typeof logo === "object") {
          const file = logo as File;
          if (existingProfile?.logo?.key) {
            try {
              await r2.send(
                new DeleteObjectCommand({
                  Bucket: "getlancer",
                  Key: existingProfile.logo.key,
                })
              );
            } catch (err) {
              console.warn("Failed to delete old logo:", err.message);
            }
          }

          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const fileName = `${userId}-${Date.now()}-${file.name}`;
          const bucketName = "getlancer";

          await r2.send(
            new PutObjectCommand({
              Bucket: bucketName,
              Key: fileName,
              Body: buffer,
              ContentType: file.type,
            })
          );

          // Store the R2 URL or key in your DB
          updateFields.logo = {
            url: `${process.env.R2_ENDPOINT}/${fileName}`,
            key: fileName,
            type: file.type,
            name: file.name
          };
        }
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const updated = await Cprofile.findOneAndUpdate(
      { user: userId },
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Client profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: updated }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}