import { SupabaseClient } from "@supabase/supabase-js";

export function calculateKarmaFromHistory(bookings: { status: string }[]): number {
  if (!bookings || bookings.length === 0) return 100;

  const relevantStatuses = ["completed", "done", "cancelled", "canceled", "no_show"];
  const pastBookings = bookings.filter((b) => relevantStatuses.includes(b.status?.toLowerCase() || ""));

  if (pastBookings.length === 0) return 100;

  const goodBookings = pastBookings.filter(
    (b) => b.status?.toLowerCase() === "completed" || b.status?.toLowerCase() === "done"
  ).length;

  return Math.round((goodBookings / pastBookings.length) * 100);
}

export async function calculateUserKarma(supabase: SupabaseClient, clientId?: string): Promise<number> {
  if (!clientId) return 100;

  try {
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("status")
      .eq("client_id", clientId);

    if (error || !bookings) {
      console.error("Error fetching bookings for karma:", error);
      return 100;
    }

    return calculateKarmaFromHistory(bookings);
  } catch (error) {
    console.error("Failed to calculate karma:", error);
    return 100;
  }
}

