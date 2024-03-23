import APIView from "@/app/lib/tools/APIView";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const jwt_token = cookies().get("jwt_token");
    const partner_token = cookies().get("partner_token");
    if (jwt_token && partner_token) {
      const api = new APIView("https://api.central.sophos.com/partner/v1/tenants?pageTotal=true");
      const res_data = api.request({
        method: "GET",
        headers: {
          "Authorization": `Bearer ${jwt_token.value}`,
          "X-Partner-ID": partner_token.value
        }
      });

      if (api.status != 200) {
        return Response.json({
          data: res_data,
          error: {
            code: "EXT_ERR",
            message: "Failed to retrieve sophos tenants"
          }
        }, { status: 500 });
      }

      return Response.json({ data: res_data }, { status: 200 });
    }
    else {
      return Response.json({ error: { code: "INV_SOP_TOK", message: "Token was not found" } }, { status: 300 });
    }
  } 
  catch {
    return Response.json({ error: { code: "EXT_ERR", message: "Unknown error" } }, { status: 500 });
  }
}