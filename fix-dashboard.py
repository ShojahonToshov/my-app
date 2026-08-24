import re

with open("src/components/dashboard-pages/Dashboard.tsx", "r", encoding="utf-8") as f:
    content = f.read()

if "import { Skeleton }" not in content:
    content = content.replace(
        'import { createClient } from "@/utils/supabase/client";',
        'import { createClient } from "@/utils/supabase/client";\nimport { Skeleton } from "@/components/ui/Skeleton";'
    )

content = content.replace(
    "const { data: bookings } = useQuery({",
    "const { data: bookings, isLoading: isBookingsLoading } = useQuery({"
)

content = content.replace(
    '<span className="text-xl font-bold text-[#121415] tabular-nums tracking-tight">{allVenueBookings.length}</span>',
    '{isBookingsLoading ? <Skeleton className="w-8 h-7 mt-1" /> : <span className="text-xl font-bold text-[#121415] tabular-nums tracking-tight">{allVenueBookings.length}</span>}'
)

content = content.replace(
    '<span className="text-xl font-bold text-[#121415] tabular-nums tracking-tight">{inChairGuests.length}</span>',
    '{isBookingsLoading ? <Skeleton className="w-8 h-7 mt-1" /> : <span className="text-xl font-bold text-[#121415] tabular-nums tracking-tight">{inChairGuests.length}</span>}'
)

content = content.replace(
    '<span className="text-xl font-bold text-[#121415] truncate pr-2" title={topService || "-"}>{topService || "-"}</span>',
    '{isBookingsLoading ? <Skeleton className="w-24 h-7 mt-1" /> : <span className="text-xl font-bold text-[#121415] truncate pr-2" title={topService || "-"}>{topService || "-"}</span>}'
)

content = content.replace(
    '<span className="text-xl font-bold text-[#121415] tabular-nums tracking-tight">{totalDelay}</span>',
    '{isBookingsLoading ? <Skeleton className="w-8 h-7 mt-1" /> : <span className="text-xl font-bold text-[#121415] tabular-nums tracking-tight">{totalDelay}</span>}'
)

with open("src/components/dashboard-pages/Dashboard.tsx", "w", encoding="utf-8") as f:
    f.write(content)
