import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  try {
    const username = process.env.VSA_UN;
    const pat = process.env.VSA_ID;
    
    // Authentication
    const headerParam = btoa(`${username}:${pat}`); // Using btoa for base64 encoding
    const url = "https://centriserve-it.vsax.net";
    const res = await fetch(`${url}/api/v3/organizations`, {
      method: "GET",
      headers: {
        "authorization": `Basic ${headerParam}`,
        "content-type": "application/json"
      }
    });

    // const res = await fetch(`https://jsonplaceholder.typicode.com/posts/1`);
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  }
  catch {
    return NextResponse.json("Failed to get users", { status: 500 });
  }
}