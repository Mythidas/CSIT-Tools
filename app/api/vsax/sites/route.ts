import { Site, _VSASiteData } from "@/app/lib/interfaces/agent/site";
import APIView from "@/app/lib/tools/APIView";

const vsa_url = "https://centriserve-it.vsax.net";
const vsa_auth = btoa(`${process.env.VSA_ID}:${process.env.VSA_SC}`);

export async function GET(req: Request) {
  try {
    let site_list: Site[] = [];
    while (site_list.length < 300) {
      const api = new APIView(`${vsa_url}/api/v3/sites?&$skip=${site_list.length}`);
      const res_data = await api.request({
        method: "GET",
        headers: {
          "authorization": `Basic ${vsa_auth}`,
          "content-type": "application/json"
        }
      }) as _VSASiteData;

      if (api.status != 200) {
        return Response.json({
          data: res_data,
          error: {
            code: "INV_API",
            message: "Failed to get VSA sites",
            display: "Failed to find VSA Sites. Contact Administrator.",
            object: res_data
          }
        }, { status: 500 })
      }
      
      for (let i = 0; i < res_data.Data.length; i++) {
        let site_name = res_data.Data[i].Name;
        if (site_name.toLowerCase().localeCompare(res_data.Data[i].ParentName.toLowerCase())) {
          site_name = res_data.Data[i].ParentName + " - " + site_name;
        }

        site_list.push({ name: site_name, vsa_id: res_data.Data[i].Id });
      }
      
      if (site_list.length >= res_data.Meta.TotalCount) {
        break;
      }
    }

    return Response.json({ data: site_list.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())) }, { status: 200 });
  }
  catch {
    return Response.json({ error: { code: "EXT_ERR", message: "Failed to get VSA sites" }}, { status: 500 });
  }
}