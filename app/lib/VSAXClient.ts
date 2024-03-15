import { Site, _VSASiteData } from "./interfaces/vsax/site";

export default class VSAXClient {
  private cached_site_list: Site[] = [];

  async get_sites(): Promise<Site[]> {
    const site_api = await fetch('/api/vsax/sites', {
      method: "GET",
    });

    const site_data: Site[] = await site_api.json() as Site[];

    return site_data;
  }

  async get_devices() {
    // const data = await fetch(`/api/vsax`, {
    //   method: "GET",
    // });

    // return data;
  }
}