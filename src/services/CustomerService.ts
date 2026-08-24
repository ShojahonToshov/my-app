import type { Customer } from "@/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export class CustomerService {
  constructor(private customer: SupabaseClient) {}
  
  private get supabase() {
    return this.customer;
  }

  async getCustomers(): Promise<Customer[]> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('role', 'customer');
    if (error) throw error;
    return data as unknown as Customer[];
  }

  async createClient(customerData: Partial<Customer>): Promise<Customer> {
    const { data, error } = await this.supabase
      .from('profiles')
      .insert([{ ...customerData, role: 'customer' }])
      .select()
      .single();
    if (error) throw error;
    return data as unknown as Customer;
  }

  async deleteCustomer(id: string): Promise<Customer> {
    const { data, error } = await this.supabase
      .from('profiles')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as Customer;
  }
}
