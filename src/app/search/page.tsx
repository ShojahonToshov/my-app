import { VenueService } from "@/services/VenueService";
import { createClient } from "@/utils/supabase/server";
import SearchClient from "./components/SearchClient";
import Footer from "@/components/Footer";

export default async function SearchPage() {
  const supabase = await createClient();
  const venueService = new VenueService(supabase);
  const venues = await venueService.getVenues();
  
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
    price: b.price ?? "$50",
    time: b.work_hours ?? "09:00-21:00",
    punctuality: b.punctuality ?? 100,
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
