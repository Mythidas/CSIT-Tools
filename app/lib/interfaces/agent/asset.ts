export interface _VSAXAsset {
  Identifier: string;
  Name: string;
  GroupName: string;
  Description: string;
  Tags: string[]; // Array of string tags
  Type: 'windows'; // Assuming all devices will be Windows for now
  ClientVersion: string;
  LastUpdated: string; // ISO 8601 date string would be ideal here 
  LastSeenOnline: string; // ISO 8601 date string
  LastReboot: string;  // ISO 8601 date string
  ExternalUrl: string;
  CpuUsage: number; // Percentage 0-100
  MemoryUsage: number; // Percentage 0-100
  MemoryTotal: number; // Bytes
  FirewallEnabled: boolean;
  AntivirusEnabled: 'enabled' | 'disabled' | 'unknown'; // More descriptive statuses
  AntivirusUpToDate: 'yes' | 'no' | 'unknown'; 
  UacEnabled: boolean;

  // Complex Objects - These likely deserve their own interfaces
  EventLogs: Object; 
  Updates: Object;

  // Arrays of complex types - Likely need separate interfaces
  AssetInfo: _Asset[]; 
  IpAddresses: _IpAddress[];
  Disks: _Disk[]; 
  InstalledSoftware: _Software[]; 

  // Identifying Information
  PublicIpAddress: string;
  ComputerId: number;
  OrganizationId: number;
  SiteId: number;
}

// Consider creating separate, more detailed interfaces for these:
interface _Asset { 
  // ...asset properties
}

interface _IpAddress {
  // ...ip address properties
}

interface _Disk {
  // ...disk properties
}

interface _Software {
  // ...software properties
}