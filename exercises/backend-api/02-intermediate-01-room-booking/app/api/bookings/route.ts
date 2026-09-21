import { createHandlers } from "../../../src/bookings";
import { bookingDependencies } from "../../../src/production-dependencies";

const handlers = createHandlers(bookingDependencies);

export const POST = handlers.POST;
