import { connect } from "@/utils/db";
import Client from "@/models/Client";
import { NextResponse } from "next/server";

export async function GET(req) {
    await connect();
    
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
    
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

export async function POST(req) {
  await connect();

  try {
    const body = await req.json();
    const { userId, company, bio, website, location } = body;

    const updated = await Client.findOneAndUpdate(
      { userId },
      { company, bio, website, location },
      { new: true, upsert: true } // Create if doesn't exist
    );

    return NextResponse.json({ success: true, updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}