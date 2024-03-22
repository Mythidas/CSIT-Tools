import { Device, DeviceList } from "./interfaces/agent/device";
import { Site, _VSASiteData } from "./interfaces/agent/site";
import APIView from "./tools/APIView";

export default class AgentClient {
  private cached_site_list: Site[] = [];
  private cached_device_list: DeviceList[] = [];
  private token_generated: boolean = false;
  private cache_expiration: number = Date.now() + 3600 * 1000;

  // Return sites from VSA. VSA has cached info for Sophos Sites available through Sophos_Link API calls
  async get_sites(): Promise<Site[]> {
    this.validate_cache();
    if (this.cached_site_list.length <= 0) {
      const site_api = await fetch('/api/vsax/sites', {
        method: "GET",
      });

      this.cached_site_list = await site_api.json() as Site[];
    }
    
    return this.cached_site_list;
  }

  // Returns sites only from Sophos. This won't get cached in the AgentClient
  async get_sophos_sites(): Promise<Site[]> {
    if (!await this.validate_token()) return [];

    
    return [];
  }

  async get_devices(site: Site): Promise<DeviceList> {
    await this.validate_cache();
    if (!await this.validate_token()) return { site_name: site.name, devices: [], rogue_devices: 0 };

    // Update Sophos_Link info and update cached site
    if (!site.sophos_id || !site.sophos_url) {
      const link_res = await fetch(`/api/vsax/sophos_link/${site.vsa_id}`);
      const link_data = (await link_res.json()) as Site;
      site.sophos_id = link_data.sophos_id;
      site.sophos_url = link_data.sophos_url;
      const site_ref = this.cached_site_list.find(value => value.name === site.name) || { name: site.name, vsa_id: site.vsa_id };
      site_ref.sophos_id = link_data.sophos_id;
      site_ref.sophos_url = link_data.sophos_url;
    }

    const device_list: DeviceList = this.cached_device_list.find(value => value.site_name === site.name) || { site_name: site.name, devices: [], rogue_devices: 0 };
    if (device_list.devices.length <= 0) {
      const vsa_device_res = await fetch(`/api/vsax/devices/${site.vsa_id}`);
      device_list.devices = (await vsa_device_res.json()) as Device[];

      if (site.sophos_url && site.sophos_id) {
        const api: APIView = new APIView;
        const sophos_device_res = await api.request_internal("/api/sophos/devices", {
          headers: {
            "x-tenant-id": `${site.sophos_id}`,
            "x-tenant-url": `${site.sophos_url}`
          }
        });

        if (sophos_device_res.error) {
          api.post_errors();
        }
        else {
          const sophos_device_data = sophos_device_res.data as Device[];

          console.log(sophos_device_res)
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

  private async get_token(): Promise<void> {
    const api_data = await fetch('/api/sophos/token');
    if (api_data.status === 200) {
      this.token_generated = true;
    }
    else {
      this.token_generated = false;
    }
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