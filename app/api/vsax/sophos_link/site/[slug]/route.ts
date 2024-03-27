import { Site, _VSASiteFields } from "@/app/lib/interfaces/agent/site";
import APIView from "@/app/lib/tools/APIView";

const vsa_url = "https://centriserve-it.vsax.net";
const vsa_auth = btoa(`${process.env.VSA_ID}:${process.env.VSA_SC}`);

export async function GET(req: Request, { params }: { params: { slug: string }}) {
  try {
    const site_id = params.slug;
    const fields_api = new APIView(`${vsa_url}/api/v3/sites/${site_id.trim()}/customfields`);
    const fields_data = await fields_api.request({
      headers: {
        "authorization": `Basic ${vsa_auth}`,
        "content-type": "application/json"
      }
    }) as _VSASiteFields;

    if (fields_api.status != 200 || fields_data.Data.length === 0) {
      return Response.json({
        error: {
          code: "INV_API",
          message: "Failed to get SophosLink info",
          object: fields_data
        }
      }, { status: 500 })
    }

    let site_link: Site = { name: "LINK", vsa_id: Number(site_id) };

    for (let i = 0; i < fields_data.Data.length; i++) {
      if (fields_data.Data[i].Name === "API-SophosApiHost") {
        site_link.sophos_url = fields_data.Data[i].Value;
      }

      if (fields_data.Data[i].Name === "API-SophosTenantID") {
        site_link.sophos_id = fields_data.Data[i].Value;
      }
    }

    return Response.json({ data: site_link }, { status: 200 });
  } 
  catch {
    return Response.json({ error: { code: "EXT_ERR", message: "Failed to get SophosLink info" }}, { status: 500 });
  }
}