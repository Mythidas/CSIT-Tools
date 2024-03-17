export interface Site {
  name: string;
  vsa_id: number;
  sophos_id?: string;
  sophos_server?: string;
}

export interface _VSASiteInfo {
  Id: number;
  Name: string;
  ParentId: number;
  ParentName: string;
  PsaIntegrationType: string;
  PsaMappingId: number;
  HasCustomFields: boolean;
}

export interface _VSAMetaInfo {
  TotalCount: number;
  ResponseCode: number;
}

export interface _VSASiteData {
  Data: _VSASiteInfo[];
  Meta: _VSAMetaInfo;
}