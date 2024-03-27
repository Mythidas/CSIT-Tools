import { Device, DeviceList } from "./interfaces/agent/device";
import { Site, _VSASiteData } from "./interfaces/agent/site";
import APIView, { APIResponse } from "./tools/APIView";

export default class AgentClient {
  private cached_site_list: Site[] = [];
  private cached_device_list: DeviceList[] = [];
  private token_generated: boolean = false;
  private cache_expiration: number = Date.now() + 3600 * 1000;

  // Return sites from VSA. VSA has cached info for Sophos Sites available through Sophos_Link API calls
  async get_sites(): Promise<Site[]> {
    this.validate_cache();
    if (this.cached_site_list.length <= 0) {
      const site_api = new APIView("/api/vsax/sites");
      const site_data = await site_api.request({
        method: "GET",
      }) as APIResponse;

      this.cached_site_list = site_data.data as Site[];
    }
    
    return this.cached_site_list;
  }

  // Returns sites only from Sophos. This won't get cached in the AgentClient
  async get_sophos_sites(): Promise<Site[]> {
    if (!await this.validate_token()) return [];

    const site_api = new APIView("/api/sophos/sites");
    const site_data = await site_api.request() as APIResponse;

    if (site_api.status !== 200) {
      return [];
    }

    this.cached_site_list = site_data.data as Site[];
    return this.cached_site_list;
  }

  async get_devices(site: Site): Promise<DeviceList> {
    await this.validate_cache();
    if (!await this.validate_token()) return { site_name: site.name, devices: [], rogue_devices: 0 };

    // Update Sophos_Link info and update cached site
    if (!site.sophos_id || !site.sophos_url) {
      const link_api = new APIView(`/api/vsax/sophos_link/site/${site.vsa_id}`);
      const link_data = await link_api.request() as APIResponse;
      
      if (link_api.ok()) {
        site.sophos_id = link_data.data.sophos_id;
        site.sophos_url = link_data.data.sophos_url;
        const site_ref = this.cached_site_list.find(value => value.name === site.name) || { name: site.name, vsa_id: site.vsa_id };
        site_ref.sophos_id = link_data.data.sophos_id;
        site_ref.sophos_url = link_data.data.sophos_url;
      }
    }

    const device_list: DeviceList = this.cached_device_list.find(value => value.site_name === site.name) || { site_name: site.name, devices: [], rogue_devices: 0 };
    if (device_list.devices.length <= 0) {
      const vsa_device_api = new APIView(`/api/vsax/devices/${site.vsa_id}`);
      const vsa_device_data = await vsa_device_api.request() as APIResponse;
      device_list.devices = vsa_device_data.data as Device[];

      if (site.sophos_url && site.sophos_id) {
        const sophos_api: APIView = new APIView("/api/sophos/devices");
        const sophos_data = await sophos_api.request({
          headers: {
            "x-tenant-id": `${site.sophos_id}`,
            "x-tenant-url": `${site.sophos_url}`
          }
        }) as APIResponse;

        if (sophos_api.status == 200) {
          const sophos_device_data = sophos_data.data as Device[];

          for (let i = 0; i < sophos_device_data.length; i++) {
            const device = device_list.devices.find(value => value.name.toLowerCase() === sophos_device_data[i].name.toLowerCase());
            if (device) {
              device.sophos_id = sophos_device_data[i].sophos_id;
            } else {
              device_list.devices.push(sophos_device_data[i]);
            }
          }
        }
      }
    }

    for (let i = 0; i < device_list.devices.length; i++) {
      if (!device_list.devices[i].sophos_id || !device_list.devices[i].vsa_id) {
        device_list.rogue_devices++;
      }
    }

    device_list.devices.sort((a, b) => a.os.toLowerCase().localeCompare(b.os.toLowerCase()));
    return device_list;
  }

  async refresh_devices(site: Site): Promise<DeviceList> {
    const device_list: DeviceList | undefined = this.cached_device_list.find(value => value.site_name === site.name);
    if (device_list) {
      device_list.devices = [];
      device_list.rogue_devices = 0;
    }

    site.sophos_id = undefined;
    site.sophos_url = undefined;
    return await this.get_devices(site);
  }

  private async get_token(): Promise<void> {
    const api = new APIView("/api/sophos/token");
    const api_data = await api.request() as APIResponse; // Data is stored in cookies
    this.token_generated = api.status === 200;
  }

  private async validate_token(): Promise<boolean> {
    await this.get_token();
    return this.token_generated;
  }

  private async validate_cache(): Promise<void> {
    if (Date.now() >= this.cache_expiration) {
      this.cached_site_list = await this.get_sites();
      this.cached_device_list = [];
      this.cache_expiration = Date.now() + 3600 * 1000;
    }
  }
}