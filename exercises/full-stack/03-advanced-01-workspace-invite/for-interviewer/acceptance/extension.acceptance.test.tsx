import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "../../src/client/App";
import { createApi } from "../../src/client/api";
import { createInMemoryTransport, createRepository } from "../../test/fixtures";

afterEach(cleanup);

describe("seat-limit acceptance UI", () => {
  it("shows seats left and disables the form when none remain", async () => {
    render(
      <App
        api={createApi(
          createInMemoryTransport(
            createRepository([
              {
                id: "ws-acme",
                name: "Acme",
                seatLimit: 3,
                members: ["owner@acme.test", "dev@acme.test"],
                invitations: [{ email: "pending@acme.test" }],
              },
            ]),
          ),
        )}
      />,
    );

    const seatsLeft = await screen.findByText(/seats left/i);
    expect(seatsLeft).toHaveTextContent("0");
    expect(screen.getByRole("button", { name: "Send invite" })).toBeDisabled();
  });
});
