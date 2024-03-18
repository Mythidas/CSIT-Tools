import { Site, _VSASiteFields } from "@/app/lib/interfaces/agent/site";

const vsa_url = "https://centriserve-it.vsax.net";
const vsa_auth = btoa(`${process.env.VSA_ID}:${process.env.VSA_SC}`);

export async function GET(req: Request, { params }: { params: { slug: string }}) {
  try {
    const site_id = params.slug;
    const fields_res = await fetch(`${vsa_url}/api/v3/sites/${site_id}/customfields`, {
      method: "GET",
      headers: {
        "authorization": `Basic ${vsa_auth}`,
        "content-type": "application/json"
      }
    });

    const fields_data = (await fields_res.json()) as _VSASiteFields;
    let site_link: Site = { name: "LINK", vsa_id: Number(site_id) };

    for (let i = 0; i < fields_data.Data.length; i++) {
      if (fields_data.Data[i].Name === "API-SophosApiHost") {
        site_link.sophos_url = fields_data.Data[i].Value;
      }

      if (fields_data.Data[i].Name === "API-SophosTenantID") {
        site_link.sophos_id = fields_data.Data[i].Value;
      }
    }

    return Response.json(site_link, { status: 200 });
  } 
  catch {
    return Response.json("Failed to get computers", { status: 500 });
  }
}