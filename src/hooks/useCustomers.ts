import { useState, useCallback, useMemo, ChangeEvent, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CustomerService from "@/services/customer/CustomerService";
import { toast } from "sonner";
import { INITIAL_CUSTOMERS } from "@/constants/customers";
import { queryKeys } from "@/lib/queryKeys";
import { Customer } from "@/types";

export default function useCustomers() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: customers = [], isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.customers.all,
    queryFn: async () => {
      const res = await CustomerService.getCustomers();
      return res && res.length > 0 ? res : (INITIAL_CUSTOMERS as unknown as Customer[]);
    }
  });

  const filteredClients = useMemo(() => {
    return customers.filter((customer: Customer) => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.phone.includes(searchTerm);
      const matchesTab = activeTab === "all" ? true : customer.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [customers, searchTerm, activeTab]);

  const handleSelectAll = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(filteredClients.map((c: Customer) => c.id));
    else setSelectedIds([]);
  }, [filteredClients]);

  const handleSelectOne = useCallback((id: string) => {
    setSelectedIds((prev: string[]) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  }, []);

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map((id: string) => CustomerService.deleteCustomer(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      setSelectedIds([]);
      toast.success("Customers deleted");
    },
    onError: () => {
      toast.error("Error deleting customers");
    }
  });

  const handleBulkDelete = useCallback(() => {
    bulkDeleteMutation.mutate(selectedIds);
  }, [selectedIds, bulkDeleteMutation]);

  const addClientMutation = useMutation({
    mutationFn: (newCustomer: Partial<Customer>) => CustomerService.createClient(newCustomer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      toast.success("Customer added successfully");
    },
    onError: () => {
      toast.error("Error adding customer");
    }
  });

  const handleAddCustomer = useCallback((e: FormEvent<HTMLFormElement>, callback?: () => void) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string) || "New Guest";
    const newCustomer: Partial<Customer> = {
      id: Date.now().toString(),
      name: name,
      phone: (formData.get("phone") as string) || "",
      status: "new",
      visits: 0,
      lastVisit: "Just now",
    };

    addClientMutation.mutate(newCustomer, {
      onSuccess: () => {
        if (callback) callback();
      }
    });
  }, [addClientMutation]);

  const deleteClientMutation = useMutation({
    mutationFn: (id: string) => CustomerService.deleteCustomer(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      setSelectedIds((prev: string[]) => prev.filter((id: string) => id !== deletedId));
      toast.success("Customer removed");
    },
    onError: () => {
      toast.error("Error removing customer");
    }
  });

  const handleDeleteClient = useCallback((clientToDelete: Customer, callback?: () => void) => {
    if (!clientToDelete) return;
    deleteClientMutation.mutate(clientToDelete.id, {
      onSuccess: () => {
        if (callback) callback();
      }
    });
  }, [deleteClientMutation]);

  const isSubmitting = bulkDeleteMutation.isPending || addClientMutation.isPending || deleteClientMutation.isPending;

  return {
    isSubmitting, isLoading, isError, handleRefetch: refetch,
    customers, filteredClients,
    searchTerm, setSearchTerm,
    activeTab, setActiveTab,
    selectedIds,
    handleSelectAll, handleSelectOne,
    handleBulkDelete, handleAddCustomer, handleDeleteClient
  };
}
