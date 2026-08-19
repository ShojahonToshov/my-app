const fs = require('fs');
const path = 'src/components/ClientBooking.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/\r\n/g, '\n');

content = content.replace(
  'import { useRouter } from "next/navigation";',
  'import { useRouter, useSearchParams } from "next/navigation";'
);

content = content.replace(
  'import BookingService from "@/services/BookingService";',
  'import BookingService from "@/services/client/BookingService";'
);

content = content.replace(
  'const venueData = {',
  'const defaultVenueData = {'
);

let target = '  const router = useRouter();\n  const { user } = useUser();\n  \n  const dates = useMemo(() => {';
let replacement = '  const router = useRouter();\n  const searchParams = useSearchParams();\n  const venueId = searchParams.get(\'id\');\n  const { user } = useUser();\n  \n  const [venueData, setVenueData] = useState(defaultVenueData);\n\n  useEffect(() => {\n    if (venueId) {\n      import(\'@/services/client/VenueService\').then(({ default: VenueService }) => {\n        VenueService.getVenueById(venueId).then((data) => {\n          if (data) {\n            setVenueData(prev => ({\n              ...prev,\n              name: data.name || prev.name,\n              address: data.address || prev.address,\n              imageUrl: data.avatarUrl || prev.imageUrl,\n            }));\n          }\n        }).catch(console.error);\n      });\n    }\n  }, [venueId]);\n\n  const dates = useMemo(() => {';
content = content.replace(target, replacement);

content = content.replace(
  '        business_id: "1", // Typically this would be dynamic based on venue',
  '        business_id: venueId || "11111111-1111-1111-1111-111111111111", // Fallback to seed UUID if venueId missing'
);

content = content.replace(
  '        date: format(selectedDate, "yyyy-MM-dd"),',
  '        date: selectedDate,'
);

content = content.replace(
  '  const availableTimes = useMemo(() => {\n    // Basic dynamic generation based on date, could be replaced with real API call\n    const times =',
  '  const availableTimes = useMemo(() => {\n    const times ='
);

content = content.replace(
  '  const [activeTab, setActiveTab] = useState("booking");\n\n  const [selectedService',
  '  const [activeTab, setActiveTab] = useState("booking");\n  const [selectedService'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Applied changes successfully');
