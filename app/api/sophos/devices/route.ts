import { Device } from "@/app/lib/interfaces/agent/device";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const jwt_token = cookies().get("jwt_token");
    const partner_token = cookies().get("partner_token");
    if (jwt_token && partner_token) {
      const sophos_id = req.headers.get("x-tenant-id");
      const sophos_url = req.headers.get("x-tenant-url");

      if (!sophos_id || !sophos_url) {
        return Response.json("Invalid headers", { status: 301 });
      }

      const device_res = await fetch(`https://${sophos_url}/endpoint/v1/endpoints`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${jwt_token.value}`,
          "X-Tenant-ID": sophos_id
        }
      });

      let device_list: Device[] = [];
      const device_data = await device_res.json();
      for (let i = 0; i < device_data.items.length; i++) {
        const device_type: string = device_data.items[i].type === "server" ? "Server" : "Workstation"; 
        device_list.push({ name: device_data.items[i].hostname, os: device_type, sophos_id: device_data.items[i].id });
      }

      return Response.json(device_list, { status: 200 });
    }
    else {
      return Response.json("Token was not found", { status: 300 });
    }
  } 
  catch {
    return Response.json("Failed to get devices", { status: 500 });
  }
}