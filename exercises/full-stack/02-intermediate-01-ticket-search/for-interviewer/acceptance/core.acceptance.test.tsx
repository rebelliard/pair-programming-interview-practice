import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "../../src/client/App";
import { createApi } from "../../src/client/api";
import { createInMemoryTransport } from "../../test/fixtures";

afterEach(cleanup);

describe("core acceptance: search UI", () => {
  it("filters the priority queue when typing in Search", async () => {
    const user = userEvent.setup();

    render(<App api={createApi(createInMemoryTransport())} />);
    await screen.findAllByRole("cell", { name: "ticket-2" });

    await user.type(screen.getByRole("textbox", { name: /Search/ }), "login");

    const queue = screen.getByRole("region", { name: "Priority queue" });
    expect(
      await within(queue).findByRole("cell", {
        name: "Production login unavailable",
      }),
    ).toBeInTheDocument();
    expect(
      within(queue).queryByRole("cell", {
        name: "Cannot export quarterly report",
      }),
    ).not.toBeInTheDocument();
  });

  it("shows the empty state for a search with no matches", async () => {
    const user = userEvent.setup();

    render(<App api={createApi(createInMemoryTransport())} />);
    await screen.findAllByRole("cell", { name: "ticket-2" });

    await user.type(screen.getByRole("textbox", { name: /Search/ }), "zzz");

    await waitFor(() => {
      expect(
        screen.queryAllByRole("cell", {
          name: "Production login unavailable",
        }),
      ).toHaveLength(0);
    });
    expect(
      screen.getByRole("region", { name: "Priority queue" }),
    ).toBeInTheDocument();
  });
});
