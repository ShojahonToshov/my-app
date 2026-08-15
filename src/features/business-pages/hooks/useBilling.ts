import React, { useState, FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";


export default function useBilling() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoading, isError, refetch } = useQuery({
    queryKey: ['billing'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return { status: "active" };
    }
  });

  const handleSaveCard = async (e: FormEvent, callback?: () => void) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800)); 

    setIsSubmitting(false);
    toast.success("Card successfully linked", {
      description: "Your default payment method has been updated.",
    });
    if (callback) callback();
  };

  const handleDownloadInvoice = (date: string) => {
    toast.info("Downloading document", {
      description: `Generating invoice for ${date}...`,
    });
  };

  return {
    isSubmitting,
    isLoading,
    isError,
    handleRefetch: refetch,
    handleSaveCard,
    handleDownloadInvoice
  };
}
