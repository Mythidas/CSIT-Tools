import { _SophosToken } from "./interfaces/sophos/token";

export default class SophosClient {
  sophos_token: string = "";
  token_expiration: Date = new Date;

  constructor() {
    this.get_token();
  }

  async get_devices() {
    if (!await this.validate_token()) return [];
    console.log(this.sophos_token);
  }

  private async get_token() {
    const api_data = await fetch("/api/sophos/token");
    const token_data = await api_data.json() as _SophosToken;
    this.sophos_token = token_data.access_token;
    this.token_expiration = new Date(new Date().getTime() + 3600000);
  }

  private async validate_token(): Promise<boolean> {
    let counter = 0;
    while (this.sophos_token === "") {
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (counter > 5) return false;
      counter++;
    }
    
    if (new Date > this.token_expiration) {
      await this.get_token();
      return this.validate_token();
    }

    return true;
  }
}