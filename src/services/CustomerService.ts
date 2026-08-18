import { createClient } from "@/utils/supabase/client";
import type { Client } from "@/types";

class CustomerService {
  private getClient(client?: any) {
    return client || createClient();
  }
  
  private get supabase() {
    return this.getClient();
  }

  async getCustomers(client?: any): Promise<Client[]> {
    const { data, error } = await this.getClient(client)
      .from('profiles')
      .select('*')
      .eq('role', 'customer');
    if (error) throw error;
    return data as unknown as Client[];
  }

  async createCustomer(customerData: Partial<Client>): Promise<Client> {
    const { data, error } = await this.supabase
      .from('profiles')
      .insert([{ ...customerData, role: 'customer' }])
      .select()
      .single();
    if (error) throw error;
    return data as unknown as Client;
  }

  async deleteCustomer(id: string): Promise<Client> {
    const { data, error } = await this.supabase
      .from('profiles')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as Client;
  }
}

export default new CustomerService();
