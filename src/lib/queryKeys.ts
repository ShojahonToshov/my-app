export const queryKeys = {
  venues: {
    all: ['venues'] as const,
    detail: (id: string) => ['venues', id] as const,
  },
  bookings: {
    all: ['bookings'] as const,
    detail: (id: string) => ['bookings', id] as const,
    byVenue: (venueId: string) => ['bookings', { venueId }] as const,
    byUser: (userId: string) => ['bookings', { userId }] as const,
    admin: (businessId: string | null | undefined) => ['adminBookings', businessId] as const,
  },
  customers: {
    all: ['customers'] as const,
    detail: (id: string) => ['customers', id] as const,
  },
  users: {
    all: ['users'] as const,
    detail: (id: string) => ['users', id] as const,
  }
};
