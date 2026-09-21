import { describe, expect, it } from "vitest";
import { createHandlers, InMemoryBookingRepository } from "../../src/bookings";

const existingBooking = {
  id: "existing",
  roomId: "amber",
  startsAt: "2026-06-01T10:00:00.000Z",
  endsAt: "2026-06-01T11:00:00.000Z",
};

function createPostHandler(bookings = [existingBooking]) {
  return createHandlers({
    repository: new InMemoryBookingRepository(bookings),
    createId: () => "booking-2",
  }).POST;
}

function bookingRequest(body: object): Request {
  return new Request("http://localhost/api/bookings", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("core acceptance: booking creation", () => {
  it("creates a booking with 201 and a Location header", async () => {
    const response = await createPostHandler([])(
      bookingRequest({
        roomId: "amber",
        startsAt: "2026-06-01T10:00:00.000Z",
        endsAt: "2026-06-01T11:00:00.000Z",
      }),
    );

    expect(response.status).toBe(201);
    expect(response.headers.get("location")).toBe("/api/bookings/booking-2");
    await expect(response.json()).resolves.toEqual({
      id: "booking-2",
      roomId: "amber",
      startsAt: "2026-06-01T10:00:00.000Z",
      endsAt: "2026-06-01T11:00:00.000Z",
    });
  });

  it("rejects an overlapping interval in the same room", async () => {
    const response = await createPostHandler()(
      bookingRequest({
        roomId: "amber",
        startsAt: "2026-06-01T10:30:00.000Z",
        endsAt: "2026-06-01T11:30:00.000Z",
      }),
    );

    expect(response.status).toBe(409);
  });

  it("allows back-to-back bookings and the same time in another room", async () => {
    const postBooking = createPostHandler();

    const backToBack = await postBooking(
      bookingRequest({
        roomId: "amber",
        startsAt: "2026-06-01T11:00:00.000Z",
        endsAt: "2026-06-01T12:00:00.000Z",
      }),
    );
    const otherRoom = await postBooking(
      bookingRequest({
        roomId: "blue",
        startsAt: "2026-06-01T10:00:00.000Z",
        endsAt: "2026-06-01T11:00:00.000Z",
      }),
    );

    expect(backToBack.status).toBe(201);
    expect(otherRoom.status).toBe(201);
  });
});
