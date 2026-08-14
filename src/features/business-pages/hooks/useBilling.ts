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
    toast.success("Р В РЎв„ўР В Р’В°Р РЋР вЂљР РЋРІР‚С™Р В Р’В° Р РЋРЎвЂњР РЋР С“Р В РЎвЂ”Р В Р’ВµР РЋРІвЂљВ¬Р В Р вЂ¦Р В РЎвЂў Р В РЎвЂ”Р РЋР вЂљР В РЎвЂ Р В Р вЂ Р РЋР РЏР В Р’В·Р В Р’В°Р В Р вЂ¦Р В Р’В°", {
      description: "Р В РІР‚в„ўР В Р’В°Р РЋРІвЂљВ¬ Р РЋР С“Р В РЎвЂ”Р В РЎвЂўР РЋР С“Р В РЎвЂўР В Р’В± Р В РЎвЂўР В РЎвЂ”Р В Р’В»Р В Р’В°Р РЋРІР‚С™Р РЋРІР‚в„– Р В РЎвЂ”Р В РЎвЂў Р РЋРЎвЂњР В РЎВ Р В РЎвЂўР В Р’В»Р РЋРІР‚РЋР В Р’В°Р В Р вЂ¦Р В РЎвЂ Р РЋР вЂ№ Р В РЎвЂўР В Р’В±Р В Р вЂ¦Р В РЎвЂўР В Р вЂ Р В Р’В»Р В Р’ВµР В Р вЂ¦.",
    });
    if (callback) callback();
  };

  const handleDownloadInvoice = (date: string) => {
    toast.info("Р В РІР‚вЂќР В Р’В°Р В РЎвЂ“Р РЋР вЂљР РЋРЎвЂњР В Р’В·Р В РЎвЂќР В Р’В° Р В РўвЂ Р В РЎвЂўР В РЎвЂќР РЋРЎвЂњР В РЎВ Р В Р’ВµР В Р вЂ¦Р РЋРІР‚С™Р В Р’В°", {
      description: `Р В Р’В¤Р В РЎвЂўР РЋР вЂљР В РЎВ Р В РЎвЂ Р РЋР вЂљР РЋРЎвЂњР В Р’ВµР В РЎВ  Р В РЎвЂќР В Р вЂ Р В РЎвЂ Р РЋРІР‚С™Р В Р’В°Р В Р вЂ¦Р РЋРІР‚В Р В РЎвЂ Р РЋР вЂ№ Р В Р’В·Р В Р’В° ${date}...`,
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
