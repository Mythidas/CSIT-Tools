import { Site, _VSASiteData } from "./interfaces/vsax/site";

export default class VSAXClient {
  private cached_site_list: Site[] = [];

  async get_sites(): Promise<Site[]> {
    if (this.cached_site_list.length <= 0) {
      const site_api = await fetch('/api/vsax/sites', {
        method: "GET",
      });

      this.cached_site_list = await site_api.json() as Site[];
    }
    
    return this.cached_site_list;
  }

  async get_devices() {
    // const data = await fetch(`/api/vsax`, {
    //   method: "GET",
    // });

    // return data;
  }
}