import { describe, expect, it } from "vitest";
import { createHandlers, InMemoryBookingRepository } from "../../src/bookings";

function bookingRequest(body: object): Request {
  return new Request("http://localhost/api/bookings", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("stretch acceptance: deletion", () => {
  it("deletes a booking so its interval becomes available again", async () => {
    const handlers = createHandlers({
      repository: new InMemoryBookingRepository([
        {
          id: "existing",
          roomId: "amber",
          startsAt: "2026-06-01T10:00:00.000Z",
          endsAt: "2026-06-01T11:00:00.000Z",
        },
      ]),
      createId: () => "booking-2",
    });

    const deleted = await handlers.DELETE(
      new Request("http://localhost/api/bookings/existing", {
        method: "DELETE",
      }),
      { params: Promise.resolve({ bookingId: "existing" }) },
    );
    const created = await handlers.POST(
      bookingRequest({
        roomId: "amber",
        startsAt: "2026-06-01T10:00:00.000Z",
        endsAt: "2026-06-01T11:00:00.000Z",
      }),
    );

    expect(deleted.status).toBe(204);
    expect(created.status).toBe(201);
  });
});
