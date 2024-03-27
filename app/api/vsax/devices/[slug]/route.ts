import { _VSAXAsset } from "@/app/lib/interfaces/agent/asset";
import { Device, _VSADeviceInfo } from "@/app/lib/interfaces/agent/device";
import APIView from "@/app/lib/tools/APIView";

const vsa_url = "https://centriserve-it.vsax.net";
const vsa_auth = btoa(`${process.env.VSA_ID}:${process.env.VSA_SC}`);

export async function GET(req: Request, { params }: { params: { slug: string }}) {
  try {
    let device_list: Device[] = [];
    const site_id = params.slug;

    const asset_api = new APIView(`${vsa_url}/api/v3/assets?&$filter=SiteId eq ${site_id}`);
    const asset_data = await asset_api.request({
      method: "GET",
      headers: {
        "authorization": `Basic ${vsa_auth}`,
        "content-type": "application/json"
      }
    });

    if (asset_api.status != 200) {
      return Response.json({
        error: {
          code: "INV_API",
          message: "Failed to get VSA devices",
          display: "Failed to get VSA devices. Contact Administrator.",
          object: asset_data
        }
      }, { status: 500 })
    }

    const device_data = asset_data.Data as _VSAXAsset[];
    for (let i = 0; i < device_data.length; i++) {
      device_list.push({ 
        name: device_data[i].Name, 
        vsa_id: device_data[i].Identifier, 
        os: device_data[i].GroupName.split(" ").slice(-1)[0],
        uptime: new Date(device_data[i].LastSeenOnline).getTime()
      });
    }

    return Response.json({ data: device_list }, { status: 200 });
  } 
  catch {
    return Response.json({ error: { code: "EXT_ERR", message: "Failed to get VSA devices" }}, { status: 500 });
  }
}