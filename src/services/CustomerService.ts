import type { Client } from "@/types";

export class CustomerService {
  constructor(private client: any) {}
  
  private get supabase() {
    return this.client;
  }

  async getCustomers(): Promise<Client[]> {
    const { data, error } = await this.supabase
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
