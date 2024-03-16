import { NextResponse } from "next/server";
import { Site, _VSASiteData } from "@/app/lib/interfaces/vsax/site";

const vsa_url = "https://centriserve-it.vsax.net";
const vsa_auth = btoa(`${process.env.VSA_ID}:${process.env.VSA_SC}`);

export async function GET(req: Request) {
  try {
    let site_list: Site[] = [];
    while (site_list.length < 300) {
      const res = await fetch(`${vsa_url}/api/v3/sites?&$skip=${site_list.length}`, {
        method: "GET",
        headers: {
          "authorization": `Basic ${vsa_auth}`,
          "content-type": "application/json"
        }
      });
      
      const data = await res.json() as _VSASiteData;
      
      for (let i = 0; i < data.Data.length; i++) {
        site_list.push({ name: data.Data[i].ParentName + " - " + data.Data[i].Name, vsa_id: data.Data[i].Id });
      }
      
      if (site_list.length >= data.Meta.TotalCount) {
        break;
      }
    }

    return NextResponse.json(site_list.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()) ), { status: 200 });
  }
  catch {
    return NextResponse.json("Failed to get users", { status: 500 });
  }
}