import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: `${process.env.SOP_ID}`,
      client_secret: `${process.env.SOP_SC}`, // Replace with your client secret
      scope: 'token'
    });

    const res = await fetch(`https://id.sophos.com/api/v2/oauth2/token`, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    })

    return NextResponse.json(await res.json(), { status: 200 });
  } 
  catch {
    return NextResponse.json("Failed to get computesr", { status: 500 });
  }
}