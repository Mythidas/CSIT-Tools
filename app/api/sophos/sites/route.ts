import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const jwt_token = cookies().get("jwt_token");
    const partner_token = cookies().get("partner_token");
    if (jwt_token && partner_token) {
      const site_res = await fetch(`https://api.central.sophos.com/partner/v1/tenants?pageTotal=true`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${jwt_token.value}`,
          "X-Partner-ID": partner_token.value
        }
      });

      const site_data = await site_res.json();
      return Response.json(site_data, { status: 200 });
    }
    else {
      return Response.json("Token was not found", { status: 300 });
    }
  } 
  catch {
    return Response.json("Failed to get sites", { status: 500 });
  }
}