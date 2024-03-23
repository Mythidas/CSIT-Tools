import { Device, _VSADeviceInfo } from "@/app/lib/interfaces/agent/device";
import APIView from "@/app/lib/tools/APIView";

const vsa_url = "https://centriserve-it.vsax.net";
const vsa_auth = btoa(`${process.env.VSA_ID}:${process.env.VSA_SC}`);

export async function GET(req: Request, { params }: { params: { slug: string }}) {
  try {
    let device_list: Device[] = [];
    const site_id = params.slug;
    const api = new APIView(`${vsa_url}/api/v3/devices?&$filter=SiteId eq ${site_id}`);
    const api_data = await api.request({
      method: "GET",
      headers: {
        "authorization": `Basic ${vsa_auth}`,
        "content-type": "application/json"
      }
    });

    if (api.status != 200) {
      return Response.json({
        data: api_data,
        error: {
          code: "INV_API",
          message: "Failed to get VSA devices",
          display: "Failed to get VSA devices. Contact Administrator."
        }
      }, { status: 500 })
    }

    const device_data = api_data.Data as _VSADeviceInfo[];
    for (let i = 0; i < device_data.length; i++) {
      device_list.push({ name: device_data[i].Name, vsa_id: device_data[i].Identifier, os: device_data[i].GroupName.slice(0, -1) });
    }

    return Response.json({ data: device_list }, { status: 200 });
  } 
  catch {
    return Response.json({ error: { code: "EXT_ERR", message: "Failed to get VSA devices" }}, { status: 500 });
  }
}