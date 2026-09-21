import { describe, expect, it } from "vitest";
import { createHandlers, InMemoryBookingRepository } from "../../src/bookings";

function createPostHandler() {
  return createHandlers({
    repository: new InMemoryBookingRepository([
      {
        id: "existing",
        roomId: "amber",
        startsAt: "2026-06-01T10:00:00.000Z",
        endsAt: "2026-06-01T11:00:00.000Z",
      },
    ]),
    createId: () => "booking-2",
  }).POST;
}

function bookingRequest(body: unknown): Request {
  return new Request("http://localhost/api/bookings", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("extension acceptance: error semantics", () => {
  it("returns JSON 400 for an invalid request shape", async () => {
    const response = await createPostHandler()(
      bookingRequest({
        roomId: "amber",
        startsAt: "not-a-date",
        endsAt: "2026-06-01T11:00:00.000Z",
      }),
    );

    expect(response.status).toBe(400);
    expect(response.headers.get("content-type")).toContain("application/json");
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "INVALID_BOOKING",
        message: "roomId, startsAt, and endsAt must describe a valid interval.",
      },
    });
  });

  it("returns distinct JSON 409 conflict semantics without a schema plugin", async () => {
    const response = await createPostHandler()(
      bookingRequest({
        roomId: "amber",
        startsAt: "2026-06-01T10:30:00.000Z",
        endsAt: "2026-06-01T11:30:00.000Z",
      }),
    );

    expect(response.status).toBe(409);
    expect(response.headers.get("content-type")).toContain("application/json");
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "BOOKING_CONFLICT",
        message: "The room is already booked for that interval.",
      },
    });
  });
});
