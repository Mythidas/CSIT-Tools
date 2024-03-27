import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import APIView from "@/app/lib/tools/APIView";

export async function GET(req: NextRequest) {
  try {
    const jwt_token = cookies().get("jwt_token");
    const partner_token = cookies().get("partner_token");
    if (jwt_token && partner_token) {
      return Response.json({ data: "Cookie validated" }, { status: 200 });
    }

    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: `${process.env.SOP_ID}`,
      client_secret: `${process.env.SOP_SC}`,
      scope: 'token'
    });

    const token_api = new APIView("https://id.sophos.com/api/v2/oauth2/token");
    const token_data = await token_api.request({
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    if (token_api.status != 200) {
      return Response.json({
        data: token_data,
        error: {
          code: "INV_API",
          message: "Failed to get Sophos Token",
          display: "Failed to validate Sophos. Contact Administrator."
        }
      }, { status: 500 })
    }

    const partner_api = new APIView("https://api.central.sophos.com/whoami/v1");
    const partner_data = await partner_api.request({
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token_data.access_token}`
      }
    });

    if (partner_api.status != 200) {
      return Response.json({
        data: partner_data,
        error: {
          code: "INV_API",
          message: "Failed to get Sophos Partner ID",
          display: "Failed to find Sophos account. Contact Administrator."
        }
      }, { status: 500 })
    }

    // TODO: Make these secure again
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

    return Response.json({ data: "Cookie generated" }, {
      status: 200,
    });
  } 
  catch {
    return Response.json({ error: { code: "EXT_ERR",  message: "Failed to get sophos tokens" }}, { status: 500 });
  }
}