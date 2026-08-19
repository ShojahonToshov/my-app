import { useState, useCallback, useMemo, ChangeEvent, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CustomerService from "@/services/client/CustomerService";
import { toast } from "sonner";
import { INITIAL_CLIENTS } from "@/constants/clients";
import { queryKeys } from "@/lib/queryKeys";
import { Client } from "@/types";

export default function useClients() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: clients = [], isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.clients.all,
    queryFn: async () => {
      const res = await CustomerService.getCustomers();
      return res && res.length > 0 ? res : (INITIAL_CLIENTS as unknown as Client[]);
    }
  });

  const filteredClients = useMemo(() => {
    return clients.filter((client: Client) => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.phone.includes(searchTerm);
      const matchesTab = activeTab === "all" ? true : client.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [clients, searchTerm, activeTab]);

  const handleSelectAll = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(filteredClients.map((c: Client) => c.id));
    else setSelectedIds([]);
  }, [filteredClients]);

  const handleSelectOne = useCallback((id: string) => {
    setSelectedIds((prev: string[]) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  }, []);

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map((id: string) => CustomerService.deleteCustomer(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      setSelectedIds([]);
      toast.success("Clients deleted");
    },
    onError: () => {
      toast.error("Error deleting clients");
    }
  });

  const handleBulkDelete = useCallback(() => {
    bulkDeleteMutation.mutate(selectedIds);
  }, [selectedIds, bulkDeleteMutation]);

  const addClientMutation = useMutation({
    mutationFn: (newClient: Partial<Client>) => CustomerService.createCustomer(newClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      toast.success("Client added successfully");
    },
    onError: () => {
      toast.error("Error adding client");
    }
  });

  const handleAddClient = useCallback((e: FormEvent<HTMLFormElement>, callback?: () => void) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string) || "New Guest";
    const newClient: Partial<Client> = {
      id: Date.now().toString(),
      name: name,
      phone: (formData.get("phone") as string) || "",
      status: "new",
      visits: 0,
      lastVisit: "Just now",
    };

    addClientMutation.mutate(newClient, {
      onSuccess: () => {
        if (callback) callback();
      }
    });
  }, [addClientMutation]);

  const deleteClientMutation = useMutation({
    mutationFn: (id: string) => CustomerService.deleteCustomer(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      setSelectedIds((prev: string[]) => prev.filter((id: string) => id !== deletedId));
      toast.success("Client removed");
    },
    onError: () => {
      toast.error("Error removing client");
    }
  });

  const handleDeleteClient = useCallback((clientToDelete: Client, callback?: () => void) => {
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
    clients, filteredClients,
    searchTerm, setSearchTerm,
    activeTab, setActiveTab,
    selectedIds,
    handleSelectAll, handleSelectOne,
    handleBulkDelete, handleAddClient, handleDeleteClient
  };
}
