const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/ClientAccount.jsx', 'utf8');

c = c.replace(/import useAuthStore from ".\/stores\/authStore";/, `import useAuthStore from "./stores/authStore";\nimport BookingService from "./api/services/BookingService";\nimport { useEffect } from "react";`);

c = c.replace(/const upcomingBookings = \[\s*\{[\s\S]*?\}\s*\];/, "const [upcomingBookings, setUpcomingBookings] = useState([]);");
c = c.replace(/const favoriteVenues = \[\s*\{[\s\S]*?\}\s*\];/, "const [favoriteVenues, setFavoriteVenues] = useState([]);");
c = c.replace(/const historyList = \[\s*\{[\s\S]*?\}\s*\];/, "const [historyList, setHistoryList] = useState([]);");

const hookCode = `
  useEffect(() => {
    if (user?.id) {
      BookingService.getUpcomingBookings(user.id).then(data => {
        // Map data to match UI expectations
        const mapped = data.map(b => ({
          id: b.id,
          date: b.date,
          time: b.time,
          venueName: b.businesses?.name || 'Unknown Venue',
          serviceName: b.services?.name || 'Service',
          masterName: 'Pro', // placeholder
          status: b.status,
        }));
        setUpcomingBookings(mapped);
      });
      BookingService.getHistoryBookings(user.id).then(data => {
        const mapped = data.map(b => ({
          id: b.id,
          date: b.date,
          time: b.time,
          venueName: b.businesses?.name || 'Unknown Venue',
          serviceName: b.services?.name || 'Service',
          masterName: 'Pro', // placeholder
          status: b.status,
          rating: b.rating,
          isReviewed: !!b.rating
        }));
        setHistoryList(mapped);
      });
    }
  }, [user]);
`;

c = c.replace(/const clientKarma = 95;\s*const isLoading = false;/, `const clientKarma = 95;\n  const [isLoading, setIsLoading] = useState(false);\n${hookCode}`);

fs.writeFileSync('src/features/market-pages/ClientAccount.jsx', c);
