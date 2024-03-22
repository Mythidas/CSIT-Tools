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
  responses: APIResponse[] = [];
  
  async request_internal(url: string, req: RequestInit): Promise<APIResponse> {
    const res = await fetch(url, req);
    if (!res.ok) {
      const err_data = await res.json() as APIResponse;
      console.log(err_data.error?.message);
      return err_data;
    }
    
    const res_data = await res.json() as APIResponse;
    this.responses.push(res_data);
    return res_data;
  }

  post_errors() {
    for (let i = 0; i < this.responses.length; i++) {
      console.log(`${this.responses[i].error?.code}: ${this.responses[i].error?.message}`);
    }

    this.responses = [];
  }
  
  async request_external<T, E>(url: string, req: RequestInit, errorCallback: (err: E) => void): Promise<T | undefined> {
    const res = await fetch(url, req);
    if (!res.ok) {
      const err_data = await res.json() as E;
      errorCallback(err_data);
      return undefined;
    }

    const res_data = await res.json() as T;
    return res_data;
  }
}