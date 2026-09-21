import { InMemoryBookingRepository } from "./bookings";

export const bookingDependencies = {
  repository: new InMemoryBookingRepository(),
  createId: crypto.randomUUID,
};
