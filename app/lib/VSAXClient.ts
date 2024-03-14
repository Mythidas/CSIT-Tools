export default class VSAXClient {
  readonly client_id: string;

  constructor() {
    this.client_id = btoa(`${process.env.VSA_UN}:${process.env.VSA_ID}`);
  }

  async get_devices() {
    const data = await fetch(`/api/vsax`, {
      method: "GET",
    });

    return data;
  }
}