import { Site } from "@/app/lib/interfaces/agent/site";
import APIView from "@/app/lib/tools/APIView";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const jwt_token = cookies().get("jwt_token");
    const partner_token = cookies().get("partner_token");
    if (jwt_token && partner_token) {
      let page_index = 1;
      let site_list: Site[] = [];
      while (site_list.length < 300) {
        const api = new APIView(`https://api.central.sophos.com/partner/v1/tenants?pageTotal=true&page=${page_index}`);
        const api_data = await api.request({
          method: "GET",
          headers: {
            "Authorization": `Bearer ${jwt_token.value}`,
            "X-Partner-ID": partner_token.value
          }
        });

        if (api.status != 200) {
          return Response.json({
            error: {
              code: "INV_API",
              message: "Failed to get Sophos sites",
              display: "Failed to find Sophos Sites. Contact Administrator.",
              object: api_data
            }
          }, { status: 500 })
        }

        for (let i = 0; i < api_data.items.length; i++) {
          site_list.push({ name: api_data.items[i].name, sophos_id: api_data.items[i].id, sophos_url: api_data.items[i].apiHost });
        }

        if (api_data.pages.total === page_index) {
          break;
        }

        page_index++;
      }

      return Response.json({ data: site_list.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())) }, { status: 200 });
    }
    else {
      return Response.json({ error: { code: "INV_SOP_TOK", message: "Token was not found" } }, { status: 300 });
    }
  } 
  catch {
    return Response.json({ error: { code: "EXT_ERR", message: "Unknown error" } }, { status: 500 });
  }
}