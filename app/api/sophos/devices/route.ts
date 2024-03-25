import { Device } from "@/app/lib/interfaces/agent/device";
import { _SophosEndpoints, _SophosEndpointsError } from "@/app/lib/interfaces/sophos/endpoint";
import APIView from "@/app/lib/tools/APIView";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const jwt_token = cookies().get("jwt_token");
    if (jwt_token) {
      const sophos_id = req.headers.get("x-tenant-id");
      const sophos_url = req.headers.get("x-tenant-url")?.replace("https://", "");

      if (!sophos_id || !sophos_url) {
        return Response.json("Invalid headers", { status: 301 });
      }

      const api = new APIView(`https://${sophos_url}/endpoint/v1/endpoints`);
      const res_data = await api.request({
        method: "GET",
        headers: {
          "Authorization": `Bearer ${jwt_token.value}`,
          "X-Tenant-ID": sophos_id
        }
      }) as _SophosEndpoints;

      if (api.status != 200) {
        return Response.json({ 
          data: res_data,
          error: { 
            code: "INV_API_RES", 
            message: "Sophos Endpoint failure", 
            display: "Failed to find devices for Sophos. Contact Administrator." 
          } 
        }, { status: 500 });
      }
      
      let device_list: Device[] = [];
      if (res_data.items) {
        for (let i = 0; i < res_data.items.length; i++) {
          const device_type: string = res_data.items[i].type === "server" ? "Server" : "Workstation"; 
          device_list.push({ name: res_data.items[i].hostname, os: device_type, sophos_id: res_data.items[i].id });
        }
      }
      
      return Response.json({ data: device_list }, { status: 200 });
    }
    else {
      return Response.json({ error: { code: "INV_SOP_TOK", message: "Token was not found" } }, { status: 500 });
    }
  } 
  catch {
    return Response.json({ error: { code: "INT_ERR", message: "Unknown error (Sophos/Devices)" } }, { status: 500 });
  }
}