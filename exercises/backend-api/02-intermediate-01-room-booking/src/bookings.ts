export type Booking = {
  id: string;
  roomId: string;
  startsAt: string;
  endsAt: string;
};

export type CreateBookingDependencies = {
  repository: InMemoryBookingRepository;
  createId: () => string;
};

export type DeleteBookingContext = {
  params: Promise<{ bookingId: string }>;
};

export class InMemoryBookingRepository {
  #bookings: Booking[];

  constructor(bookings: Booking[] = []) {
    this.#bookings = [...bookings];
  }

  list(): Booking[] {
    return [...this.#bookings];
  }

  insert(booking: Booking): void {
    this.#bookings.push(booking);
  }

  remove(id: string): boolean {
    const bookingIndex = this.#bookings.findIndex(
      (booking) => booking.id === id,
    );

    if (bookingIndex === -1) {
      return false;
    }

    this.#bookings.splice(bookingIndex, 1);
    return true;
  }
}

export function createHandlers({
  repository,
  createId,
}: CreateBookingDependencies) {
  return {
    async POST(request: Request): Promise<Response> {
      void request;
      void repository;
      void createId;

      return Response.json(
        {
          error: {
            code: "NOT_IMPLEMENTED",
            message: "Booking creation is not available yet.",
          },
        },
        { status: 501 },
      );
    },

    async DELETE(
      request: Request,
      context: DeleteBookingContext,
    ): Promise<Response> {
      void request;
      void context;

      return Response.json(
        {
          error: {
            code: "NOT_IMPLEMENTED",
            message: "Booking deletion is not available yet.",
          },
        },
        { status: 501 },
      );
    },
  };
}
