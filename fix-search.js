const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/Search.jsx', 'utf8');

c = c.replace(/const MOCK_VENUES = \[[\s\S]*?\];/, '');

// Need to import BookingService and useEffect
if (!c.includes('BookingService')) {
  c = c.replace(/import { useLockBodyScroll } from "@\/hooks\/useLockBodyScroll";/, `import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";\nimport BookingService from "./api/services/BookingService";`);
}

// In the component
c = c.replace(/export default function Search\(\) {/, `export default function Search() {\n  const [venues, setVenues] = useState([]);\n  const [isLoading, setIsLoading] = useState(true);\n\n  useEffect(() => {\n    BookingService.getBusinesses().then(data => {\n      const formatted = data.map(b => ({\n        id: b.id,\n        name: b.name,\n        category: b.category,\n        rating: b.rating,\n        reviews: 0,\n        address: b.address,\n        distance: "1 km",\n        imageUrl: b.image_url,\n        tags: [b.category],\n        priceRange: "$$",\n      }));\n      setVenues(formatted);\n      setIsLoading(false);\n    });\n  }, []);\n`);

c = c.replace(/const filteredVenues = MOCK_VENUES.filter\(\(venue\) => {/, `const filteredVenues = venues.filter((venue) => {`);

fs.writeFileSync('src/features/market-pages/Search.jsx', c);
