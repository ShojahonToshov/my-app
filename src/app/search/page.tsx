import { VenueService } from "@/services/VenueService";
import { createClient } from "@/utils/supabase/server";
import SearchClient from "./components/SearchClient";
import Footer from "@/components/Footer";

export default async function SearchPage() {
  const supabase = await createClient();
  const venueService = new VenueService(supabase);
  const venues = await venueService.getVenues();
  
  const DEMO_HOURS = [
    "00:00-23:59", "08:00-22:00", "09:00-21:00", "10:00-20:00", "11:00-23:00", "07:00-19:00",
  ];
  const demoTime = (id: string) => {
    const idx = id.charCodeAt(0) % DEMO_HOURS.length;
    return DEMO_HOURS[idx];
  };

  const formattedVenues = venues.map((b: any) => ({
    id: b.id,
    name: b.name,
    category: b.category ?? "General",
    rating: b.rating ?? 5,
    reviews: b.reviews_count ?? 0,
    coordinates: b.coordinates ?? { x: 0, y: 0 },
    address: b.address ?? "",
    distance: "1 km",
    image: b.image_url ?? "",
    price: " - $50",
    time: b.work_hours ?? demoTime(b.id),
    tags: b.tags ?? [b.category ?? "General"],
    badges: b.badges ?? [],
  }));

  return (
    <>
      <SearchClient initialVenues={formattedVenues} />
      <Footer />
    </>
  );
}
