import { _SophosToken } from "./interfaces/agent/token";
import { Site, _VSASiteData } from "./interfaces/agent/site";

export default class AgentClient {
  private cached_site_list: Site[] = [];
  private sophos_token: string = "";
  private sophos_expiration: Date = new Date;

  constructor() {
    this.get_token();
  }

  async get_sites(): Promise<Site[]> {
    if (this.cached_site_list.length <= 0) {
      const site_api = await fetch('/api/vsax/sites', {
        method: "GET",
      });

      this.cached_site_list = await site_api.json() as Site[];
    }
    
    return this.cached_site_list;
  }

  async get_devices(site: Site) {
    // Checl sophos token and site sophos variables
    // Pulls VSA Computer List
    // Pull Sophos Computer list
    // Match computers using MAC address into a new list
    // return list
  }

  private async get_token() {
    const api_data = await fetch("/api/sophos/token");
    const token_data = await api_data.json() as _SophosToken;
    this.sophos_token = token_data.access_token;
    this.sophos_expiration = new Date(new Date().getTime() + 3600000);
  }

  private async validate_token(): Promise<boolean> {
    let counter = 0;
    while (this.sophos_token === "") {
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (counter > 5) return false;
      counter++;
    }
    
    if (new Date > this.sophos_expiration) {
      await this.get_token();
      return this.validate_token();
    }

    return true;
  }
}