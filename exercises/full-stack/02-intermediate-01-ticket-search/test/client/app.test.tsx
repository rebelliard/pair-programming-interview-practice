import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "../../src/client/App";
import { createApi } from "../../src/client/api";
import { createInMemoryTransport } from "../fixtures";

function firstCellsOf(regionName: string): Array<string | undefined> {
  const region = screen.getByRole("region", { name: regionName });
  const rows = within(region).getAllByRole("row").slice(1);

  return rows.map((row) => within(row).getAllByRole("cell")[0]?.textContent);
}

describe("App", () => {
  it("keeps the priority queue in server order after recent activity renders, then filters", async () => {
    const user = userEvent.setup();

    render(<App api={createApi(createInMemoryTransport())} />);
    await screen.findByRole("cell", { name: "ticket-2" });

    expect(firstCellsOf("Priority queue")).toEqual([
      "Production login unavailable",
      "Payment processor recovered",
      "Invoice contains the wrong address",
      "Team member cannot upload a logo",
      "Cannot export quarterly report",
      "Reset an archived workspace",
      "Dashboard loads slowly",
      "Change notification language",
    ]);
    expect(firstCellsOf("Recent activity")).toEqual([
      "ticket-2",
      "ticket-3",
      "ticket-1",
      "ticket-5",
      "ticket-6",
      "ticket-8",
      "ticket-7",
      "ticket-4",
    ]);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Priority" }),
      "urgent",
    );
    await waitFor(() => {
      expect(
        screen.queryByRole("cell", { name: "ticket-1" }),
      ).not.toBeInTheDocument();
    });

    expect(firstCellsOf("Priority queue")).toEqual([
      "Production login unavailable",
      "Payment processor recovered",
    ]);
    expect(firstCellsOf("Recent activity")).toEqual(["ticket-2", "ticket-6"]);
  });
});
