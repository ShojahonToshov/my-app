import { apiClient } from "../client";
import type { Client } from "../../types";

class CustomerService {
  async getCustomers(): Promise<Client[]> {
    return (await apiClient.get("/customers")) as unknown as Client[];
  }

  async createCustomer(customerData: Partial<Client>): Promise<Client> {
    return (await apiClient.post("/customers", customerData)) as unknown as Client;
  }

  async deleteCustomer(id: string): Promise<Client> {
    return (await apiClient.delete(`/customers/${id}`)) as unknown as Client;
  }
}

export default new CustomerService();
