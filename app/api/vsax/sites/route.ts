import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

const vsa_url = "https://centriserve-it.vsax.net";
const vsa_auth = btoa(`${process.env.VSA_UN}:${process.env.VSA_ID}`);

export async function GET(req: Request) {
  try {
    // Authentication
    const res = await fetch(`${vsa_url}/api/v3/sites`, {
      method: "GET",
      headers: {
        "authorization": `Basic ${vsa_auth}`,
        "content-type": "application/json"
      }
    });

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  }
  catch {
    return NextResponse.json("Failed to get users", { status: 500 });
  }
}