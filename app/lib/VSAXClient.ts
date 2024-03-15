interface Site {
  name: string;
  vsa_id: number;
  sophos_id: number;
}

export default class VSAXClient {
  async get_sites(): Promise<Site[]> {
    const api_data = await fetch('/api/vsax/sites', {
      method: "GET",
    });

    await api_data.json()
      .then(val => console.log(val));

    return [{ name: "test", vsa_id: 10, sophos_id: 11 }];
  }

  async get_devices() {
    const data = await fetch(`/api/vsax`, {
      method: "GET",
    });

    return data;
  }
}