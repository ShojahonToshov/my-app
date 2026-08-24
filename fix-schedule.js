const fs = require('fs');

let content = fs.readFileSync('src/components/dashboard-pages/Schedule.tsx', 'utf8');

if (!content.includes('import { Skeleton }')) {
    content = content.replace(
        'import customerBookingService from "@/services/customer/BookingService";',
        'import customerBookingService from "@/services/customer/BookingService";\nimport { Skeleton } from "@/components/ui/Skeleton";'
    );
}

if (!content.includes('const [isLoading, setIsLoading] = useState(true);')) {
    content = content.replace(
        'const [appointments, setAppointments] = useState<Appointment[]>([]);',
        'const [appointments, setAppointments] = useState<Appointment[]>([]);\n  const [isLoading, setIsLoading] = useState(true);'
    );
}

content = content.replace(
    'const data = await customerBookingService.getBookings();',
    'setIsLoading(true);\n        const data = await customerBookingService.getBookings();'
);

content = content.replace(
    'setAppointments(mappedAppointments);\n        }',
    'setAppointments(mappedAppointments);\n        }\n        if (isMounted) setIsLoading(false);'
);

content = content.replace(
    'toast.error("Failed to load schedule");\n      }',
    'toast.error("Failed to load schedule");\n      }\n      if (isMounted) setIsLoading(false);'
);

const renderSearch = {apptsInSlot.length > 0 ? (;
const renderReplace = {isLoading ? (
                              <div className="w-full h-full min-h-[120px] bg-white border border-[#DCDCDA] rounded-xl p-3 flex flex-col justify-between">
                                <Skeleton className="w-20 h-4 mb-2" />
                                <Skeleton className="w-24 h-3 mb-1" />
                                <Skeleton className="w-16 h-3 mb-2" />
                                <div className="mt-auto pt-2 border-t border-[#F5F5F4] flex justify-between">
                                  <Skeleton className="w-16 h-3" />
                                  <Skeleton className="w-12 h-4" />
                                </div>
                              </div>
                            ) : apptsInSlot.length > 0 ? (;

content = content.replace(renderSearch, renderReplace);

fs.writeFileSync('src/components/dashboard-pages/Schedule.tsx', content, 'utf8');
