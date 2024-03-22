export interface _SophosEndpoints {
  items: Endpoint[];
  pages: {
    fromKey?: string,
    nextKey?: string,
    size: number,
    total?: number,
    items?: number,
    maxSize: number
  }
}

export interface _SophosEndpointsError {
  error: string,
  message?: string,
  correlationId: string,
  code: string,
  createdAt: string,
  requestId: string,
  docUrl: string
}

interface Endpoint {
  id: string; // Required UUID
  type: 'computer' | 'server' | 'securityVm'; // Specific allowed values
  tenant: Tenant;
  hostname: string;
  health: 'good' | 'suspicious' | 'bad' | 'unknown';
  os: OS;
  ipv4Addresses: string[]; // Array of IPv4 addresses
  ipv6Addresses: string[]; // Array of IPv6 addresses
  macAddresses: string[];  // Array of MAC addresses
  group?: EndpointGroup; // Optional group association
  associatedPerson?: Person;
  tamperProtectionEnabled: boolean; 
  assignedProducts: Product[]; // Replace 'Product' with an appropriate interface
  lastSeenAt: string; // UTC date and time
  encryption?: Encryption; // Optional encryption data
  lockdown: Lockdown;
  online: boolean;
  cloud?: Cloud; // Optional cloud details
  isolation?: Isolation; // Optional isolation details 
}

interface Tenant {
  id: string; // UUID
  // Other tenant properties as needed
}

interface OS {
  platform: 'windows' | 'linux' | 'macOS'; 
  // Other OS details if necessary
}

interface EndpointGroup {
  name: string;
  id: string; // UUID
}

interface Person {
  name: string;
  viaLogin: string;
  id: string; // UUID
}

// You may need to define these interfaces based on your data:
interface Encryption { 
  // Encryption-related properties
  volumes: {
    volumeId: string,
    status: string
  }[]
}

interface Lockdown {
  status: 'creatingWhitelist' | 'installing' | 'locked' | 'notInstalled' | 
  'registering' | 'starting' | 'stopping' | 'unavailable' | 'uninstalled' | 'unlocked';
  updateStatus: 'upToDate' | 'updating' | 'rebootRequired' | 'notInstalled';
}

interface Cloud {
  provider: 'aws' | 'azure';
  // Other cloud properties
}

interface Isolation {
  status: 'isolated' | 'notIsolated'; 
  //  Other isolation properties
}

interface Product {
  code: string,
  version: string,
  status?: string
}