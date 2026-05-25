import { connect } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import Fprofile from "@/models/Fprofile";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { FprofileType } from "@/types/User";

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

        // Use 'user' field to match the Fprofile model schema
        const freelancerProfile = await Fprofile.findOne({ user: userId });

        if (!freelancerProfile) {
            return NextResponse.json({ success: false, error: "Freelancer profile not found" }, { status: 404 });
        }

        // Generate signed URL for profile picture if it exists
        if (freelancerProfile.profilePic?.key) {
            const command = new GetObjectCommand({
                Bucket: "getlancer",
                Key: freelancerProfile.profilePic.key,
            });

            const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });
            freelancerProfile.profilePic.url = signedUrl;
        }

        return NextResponse.json({ success: true, freelancerProfile }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await connect();

    try {
        const body = await req.json();
        const { userId, title, skills, bio, hourlyRate, experience, location, profilePic, socialLinks, projects } = body;

        if (!userId) {
            return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
        }

        const updateFields: Partial<FprofileType> = {
            title: title?.toString(),
            bio: bio?.toString(),
            skills: skills,
            hourlyRate: Number(hourlyRate),
            experience: experience,
            location: location?.toString(),
            socialLinks: socialLinks,
            projects: projects
        };

        // Handle base64 profile picture if provided
        if (profilePic && typeof profilePic === 'string' && profilePic.startsWith('data:')) {
            // This is a base64 image, store it as-is for now
            // In production, you'd want to upload this to S3/R2
            updateFields.profilePic = {
                url: profilePic,
                name: "",
                type: "",
                key: ""
            };
        }

        const updated = await Fprofile.findOneAndUpdate(
            { user: userId },
            { $set: updateFields },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, updated }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    await connect();

    try {
        const formData = await req.formData();

        const userId = formData.get("userId");
        const title = formData.get("title");
        const bio = formData.get("bio");
        const hourlyRate = formData.get("hourlyRate");
        const location = formData.get("location");
        const skillsJSON = formData.get("skills");
        const experienceJSON = formData.get("experience");
        const socialLinksJSON = formData.get("socialLinks");
        const projectsJSON = formData.get("projects");
        const profilePic = formData.get("profilePic");

        if (!userId) {
            return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
        }

        const updateFields: Partial<FprofileType> = {
            title: title?.toString(),
            bio: bio?.toString(),
            hourlyRate: Number(hourlyRate),
            location: location?.toString(),
        };

        // Parse JSON fields
        if (skillsJSON) {
            try {
                updateFields.skills = JSON.parse(skillsJSON as string);
            } catch (e) {
                return NextResponse.json({ success: false, error: "Invalid skills format" }, { status: 400 });
            }
        }

        if (experienceJSON) {
            try {
                updateFields.experience = JSON.parse(experienceJSON as string);
            } catch (e) {
                return NextResponse.json({ success: false, error: "Invalid experience format" }, { status: 400 });
            }
        }

        if (socialLinksJSON) {
            try {
                updateFields.socialLinks = JSON.parse(socialLinksJSON as string);
            } catch (e) {
                return NextResponse.json({ success: false, error: "Invalid social links format" }, { status: 400 });
            }
        }

        if (projectsJSON) {
            try {
                updateFields.projects = JSON.parse(projectsJSON as string);
            } catch (e) {
                return NextResponse.json({ success: false, error: "Invalid projects format" }, { status: 400 });
            }
        }

        const existingProfile = await Fprofile.findOne({ user: userId });

        // Handle profile picture upload
        if (profilePic && typeof profilePic === "object") {
            // Delete old profile picture if exists
            if (existingProfile?.profilePic?.key) {
                try {
                    await r2.send(
                        new DeleteObjectCommand({
                            Bucket: "getlancer",
                            Key: existingProfile.profilePic.key,
                        })
                    );
                } catch (err) {
                    console.warn("Failed to delete old profile picture:", err.message);
                }
            }

            const bytes = await profilePic.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileName = `freelancer-${userId}-${Date.now()}-${profilePic.name}`;
            const bucketName = "getlancer";

            await r2.send(
                new PutObjectCommand({
                    Bucket: bucketName,
                    Key: fileName,
                    Body: buffer,
                    ContentType: profilePic.type,
                })
            );

            updateFields.profilePic = {
                url: `${process.env.R2_ENDPOINT}/${fileName}`,
                key: fileName,
                name: profilePic.name,
                type: profilePic.type,
            };
        }

        const updatedProfile = await Fprofile.findOneAndUpdate(
            { user: userId },
            { $set: updateFields },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, profile: updatedProfile }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}