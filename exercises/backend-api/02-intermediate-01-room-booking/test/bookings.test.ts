import { describe, expect, it } from "vitest";
import { POST } from "../app/api/bookings/route";
import { createHandlers, InMemoryBookingRepository } from "../src/bookings";

describe("booking API starter", () => {
  it("exposes a POST handler from the Next route", () => {
    expect(POST).toBeTypeOf("function");
  });

  it("returns a JSON response from the injected handler", async () => {
    const { POST: postBooking } = createHandlers({
      repository: new InMemoryBookingRepository(),
      createId: () => "booking-1",
    });

    const response = await postBooking(
      new Request("http://localhost/api/bookings", { method: "POST" }),
    );

    expect(response.headers.get("content-type")).toContain("application/json");
    await expect(response.json()).resolves.toBeTypeOf("object");
  });
});
