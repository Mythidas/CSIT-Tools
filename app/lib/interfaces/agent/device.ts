export interface Device {
  name: string,
  os: string,
  vsa_id?: string,
  sophos_id?: string
}

export interface DeviceList {
  site_name: string,
  devices: Device[]
  rogue_devices: number;
}

export interface _VSADeviceInfo {
  GroupId: number,
  GroupName: string,
  HasCustomFields: boolean,
  Identifier: string,
  IsAgentInstalled: boolean,
  IsMdmEnrolled: boolean,
  Name: string,
  OrganizationId: number,
  OrganizationName: string,
  SiteId: number,
  SiteName: string
}