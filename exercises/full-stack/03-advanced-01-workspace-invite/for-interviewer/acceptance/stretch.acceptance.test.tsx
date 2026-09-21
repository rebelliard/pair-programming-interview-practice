import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "../../src/client/App";
import { createApi } from "../../src/client/api";
import { createInMemoryTransport } from "../../test/fixtures";

afterEach(cleanup);

describe("invitation acceptance stretch UI", () => {
  it("moves an accepted invitation to members", async () => {
    const user = userEvent.setup();

    render(<App api={createApi(createInMemoryTransport())} />);
    const invitations = await screen.findByRole("region", {
      name: "Invitations",
    });
    const pendingRow = within(invitations)
      .getByRole("cell", { name: "pending@acme.test" })
      .closest("tr");
    if (pendingRow === null) {
      throw new Error("Missing pending invitation row");
    }

    await user.click(
      within(pendingRow).getByRole("button", {
        name: /^Accept(?:\s|$)/,
      }),
    );

    expect(
      await within(screen.getByRole("region", { name: "Members" })).findByRole(
        "cell",
        { name: "pending@acme.test" },
      ),
    ).toBeInTheDocument();
    expect(
      within(invitations).queryByRole("cell", { name: "pending@acme.test" }),
    ).not.toBeInTheDocument();
  });
});
