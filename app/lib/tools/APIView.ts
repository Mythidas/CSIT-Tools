export interface APIResponse {
  data?: any;
  error?: APIError
}

interface APIError {
  code: string,
  message: string,
  display?: string // Optional message to display to users
}

export default class APIView {
  url: string;
  status: number = 0;
  response: APIResponse = {};

  constructor(url: string) {
    this.url = url;
  }
  
  async request_internal(req: RequestInit): Promise<any> {
    const res = await fetch(this.url, req);
    this.status = res.status;
    this.response = await res.json() as APIResponse;
    return this.response.data;
  }

  async request_external(req: RequestInit): Promise<any> {
    const res = await fetch(this.url, req);
    this.status = res.status;
    if (!res.ok) {
      this.response.error = {
        code: "EXT_ERR",
        message: "Failed to retrieve API data"
      }
    }

    this.response.data = await res.json();
    return this.response.data;
  }
}