export const queryKeys = {
  venues: {
    all: ['venues'],
    detail: (id: string) => ['venues', id],
  },
  bookings: {
    all: ['bookings'],
    detail: (id: string) => ['bookings', id],
    byVenue: (venueId: string) => ['bookings', { venueId }],
    byUser: (userId: string) => ['bookings', { userId }],
  },
  clients: {
    all: ['clients'],
    detail: (id: string) => ['clients', id],
  },
  users: {
    all: ['users'],
    detail: (id: string) => ['users', id],
  }
};
