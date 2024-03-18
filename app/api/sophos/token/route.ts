import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const jwt_token = cookies().get("jwt_token");
    const partner_token = cookies().get("partner_token");
    if (jwt_token && partner_token) {
      return Response.json("Cookie validated", { status: 200 });
    }

    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: `${process.env.SOP_ID}`,
      client_secret: `${process.env.SOP_SC}`,
      scope: 'token'
    });

    const res_data = await fetch(`https://id.sophos.com/api/v2/oauth2/token`, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    })

    const token_data = await res_data.json();

    const partner_res = await fetch("https://api.central.sophos.com/whoami/v1", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token_data.access_token}`
      }
    });

    const partner_data = await partner_res.json();

    cookies().set("partner_token", partner_data.id, {
      maxAge: 3600,
      httpOnly: true,
      secure: process.env.NODE_ENV != "development",
      sameSite: "strict"
    })
    cookies().set("jwt_token", token_data.access_token, {
      maxAge: 3600,
      httpOnly: true,
      secure: process.env.NODE_ENV != "development",
      sameSite: "strict"
    });

    return Response.json("Cookie generated", {
      status: 200,
    });
  } 
  catch {
    return Response.json("Failed to get tokens", { status: 500 });
  }
}