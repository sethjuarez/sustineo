import { API_ENDPOINT } from "store/endpoint";

export interface Design {
  id: string;
  background: string;
  default: boolean;
  logo: string;
  title: string;
  sub_title: string;
  description: string; // Optional field for description
}

export interface DesignAction {
  id: string;
  action: string;
  error?: string;
}

export class DesignConfiguration {
  endpoint: string;

  constructor() {
    this.endpoint = API_ENDPOINT;
  }

  async fetchDesigns(): Promise<Design[]> {
    const response = await fetch(`${this.endpoint}/api/design/`);
    if (!response.ok) {
      throw new Error("Failed to fetch designs");
    }
    const designs = await response.json();
    return designs;
  }

  async fetchDesign(id: string): Promise<Design> {
    const response = await fetch(`${this.endpoint}/api/design/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch design");
    }
    return await response.json();
  }

  async createDesign(design: Design): Promise<Design> {
    console.log("Creating design", design);
    const response = await fetch(`${this.endpoint}/api/design/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: design.id,
        background: design.background,
        default: design.default,
        logo: design.logo,
        title: design.title,
        sub_title: design.sub_title,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to create design");
    }
    const c =  await response.json();
    console.log("Created design", c);
    return c;
  }

  async updateDesign(designId: string, design: Design): Promise<Design> {
    const response = await fetch(`${this.endpoint}/api/design/${designId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(design),
    });
    if (!response.ok) {
      throw new Error("Failed to update design");
    }

    const c = await response.json();
    console.log("Updated design", c);
    return c;
  }

  async deleteDesign(id: string): Promise<DesignAction> {
    const response = await fetch(`${this.endpoint}/api/design/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete design");
    }
    return await response.json();
  }

  async setDefaultDesign(id: string): Promise<DesignAction> {
    const response = await fetch(`${this.endpoint}/api/design/default/${id}`, {
      method: "PUT",
    });
    if (!response.ok) {
      throw new Error("Failed to set default design");
    }
    return await response.json();
  }

  async fetchDefaultDesign(): Promise<Design> {
    const response = await fetch(`${this.endpoint}/api/design/default`);
    if (!response.ok) {
      throw new Error("Failed to fetch default design");
    }
    return await response.json();
  }
}