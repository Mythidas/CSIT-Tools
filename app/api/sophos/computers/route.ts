import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    
  } 
  catch {
    NextResponse.json("Failed to get computesr", { status: 500 });
  }
}