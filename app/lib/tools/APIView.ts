export interface APIResponse {
  data?: any;
  error?: APIError
}

interface APIError {
  code: string,
  message: string,
  display?: string // Optional message to display to users
  object?: any // Optional data to be passed
}

export default class APIView {
  url: string;
  status: number = 0;
  private is_local: boolean;

  constructor(url: string) {
    this.url = url;
    this.is_local = url.charAt(0) === '/';
  }

  async request(req?: RequestInit): Promise<any> {
    const res = await fetch(this.url, req);
    this.status = res.status;
    const res_data = await res.json();
    
    if (res.status !== 200 && this.is_local) {
      this.post_error(res_data);
    }
    
    return res_data;
  }

  post_error(res: APIResponse) {
    console.log(`${res.error?.code}: ${res.error?.message}`);
    if (res.error?.object) {
      console.log("Obj Dump: ");
      console.log(res.error.object);
    }
  }

  ok(): boolean {
    return this.status === 200;
  }
}