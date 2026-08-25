import type { Customer } from "@/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export class CustomerService {
  constructor(private customer: SupabaseClient) {}
  
  private get supabase() {
    return this.customer;
  }

  async getCustomers(): Promise<Customer[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    let businessId = null;
    if (user) {
      const { data: business } = await this.supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle();
      if (business) businessId = business.id;
    }

    if (!businessId) {
      return [];
    }

    // 1. Fetch profiles (might belong to this business if column exists)
    let profilesQuery = this.supabase.from('profiles').select('*').eq('role', 'customer');
    const { data: profilesData, error: profilesError } = await profilesQuery;
    if (profilesError) throw profilesError;

    // 2. Fetch bookings
    let bookingsQuery = this.supabase.from('bookings').select('*');
    if (businessId) bookingsQuery = bookingsQuery.eq('business_id', businessId);
    
    const { data: bookingsData, error: bookingsError } = await bookingsQuery;
    if (bookingsError) throw bookingsError;

    // 3. Fetch services to calculate LTV
    let servicesQuery = this.supabase.from('services').select('id, price');
    if (businessId) servicesQuery = servicesQuery.eq('business_id', businessId);
    
    const { data: servicesData, error: servicesError } = await servicesQuery;
    if (servicesError) throw servicesError;

    const servicePriceMap = new Map<string, number>();
    if (servicesData) {
      for (const s of servicesData) {
        if (s.id) {
          const price = typeof s.price === 'string' ? parseFloat(s.price) : (typeof s.price === 'number' ? s.price : 0);
          servicePriceMap.set(s.id, isNaN(price) ? 0 : price);
        }
      }
    }

    const customersMap = new Map<string, Record<string, unknown>>();

    // Add manual customers
    if (profilesData) {
      for (const p of profilesData) {
        // If profile has business_id and it doesn't match, skip
        if (businessId && p.business_id && p.business_id !== businessId) continue;
        // If we strictly want to isolate and profile has no business_id but we have one, should we skip?
        // Usually global profiles (no business_id) might be admins, but we only fetched 'customer' role.
        // It's safer to skip if businessId is required but missing, unless it's null.
        if (businessId && p.business_id === undefined) {
          // If the column doesn't exist, we can't filter. But if it exists and is null/different, we skip.
          if ('business_id' in p && p.business_id !== businessId) continue;
        }

        const key = p.phone || p.id;
        if (key) {
          customersMap.set(key, {
            id: p.id,
            name: p.name || p.full_name || 'Unknown',
            phone: p.phone || '',
            visits: 0,
            lastVisit: 'Never',
            totalSpent: 0,
            status: p.status === 'regular' ? 'regular' : 'new',
            color: p.color,
            tag: p.tag
          });
        }
      }
    }

    // Process bookings
    if (bookingsData) {
      for (const b of bookingsData) {
        const name = b.guest_name || b.customerName || b.client_name || 'Guest';
        const phone = b.guest_phone || b.customerPhone || b.client_phone || '';
        
        if (!phone && name === 'Guest') continue;
        
        const key = phone || name;
        
        let customer = customersMap.get(key);
        if (!customer) {
          customer = {
            id: b.client_id || b.customerId || key,
            name: name,
            phone: phone,
            visits: 0,
            lastVisit: 'Never',
            totalSpent: 0,
            status: 'new'
          };
          customersMap.set(key, customer);
        }

        (customer.visits as number) += 1;
        
        // Update LTV
        const price = b.service_id ? (servicePriceMap.get(b.service_id) || 0) : 0;
        (customer.totalSpent as number) += price;

        // Update status
        if ((customer.visits as number) >= 3) {
          customer.status = 'regular';
        }

        // Update lastVisit
        if (b.date) {
          if (customer.lastVisit === 'Never') {
            customer.lastVisit = b.date;
          } else {
            const currentLastVisit = new Date(customer.lastVisit as string);
            const bookingDate = new Date(b.date);
            if (!isNaN(bookingDate.getTime()) && bookingDate > currentLastVisit) {
              customer.lastVisit = b.date;
            }
          }
        }
      }
    }

    return Array.from(customersMap.values()).map(c => {
      const spent = c.totalSpent as number;
      const ltv = spent > 0 ? `${spent.toLocaleString('en-US').replace(/,/g, ' ')} UZS` : '0 UZS';
      
      return {
        ...c,
        ltv,
        totalSpent: ltv
      } as unknown as Customer;
    });
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

  async deleteCustomer(id: string): Promise<Customer | null> {
    // If id is not a UUID, it might be an auto-generated customer from bookings
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (!isUuid) {
      console.warn('Cannot delete auto-generated customer from bookings:', id);
      return null;
    }

    const { data, error } = await this.supabase
      .from('profiles')
      .delete()
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data as unknown as Customer;
  }
}
