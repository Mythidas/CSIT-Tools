import { Device, _VSADeviceInfo } from "@/app/lib/interfaces/agent/device";

const vsa_url = "https://centriserve-it.vsax.net";
const vsa_auth = btoa(`${process.env.VSA_ID}:${process.env.VSA_SC}`);

export async function GET(req: Request, { params }: { params: { slug: string }}) {
  try {
    let device_list: Device[] = [];
    const site_id = params.slug;
    const device_res = await fetch(`${vsa_url}/api/v3/devices?&$filter=SiteId eq ${site_id}`, {
      method: "GET",
      headers: {
        "authorization": `Basic ${vsa_auth}`,
        "content-type": "application/json"
      }
    })

    const device_data = (await device_res.json()).Data as _VSADeviceInfo[];
    for (let i = 0; i < device_data.length; i++) {
      device_list.push({ name: device_data[i].Name, vsa_id: device_data[i].Identifier, os: device_data[i].GroupName.slice(0, -1) });
    }

    return Response.json(device_list, { status: 200 });
  } 
  catch {
    return Response.json("Failed to get computers", { status: 500 });
  }
}