import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "../../src/client/App";
import { createApi } from "../../src/client/api";
import {
  accepted,
  createDependencies,
  createInMemoryTransport,
} from "../fixtures";

afterEach(cleanup);

describe("Deliveries page", () => {
  it("renders the seeded delivery rows", async () => {
    render(<App api={createApi(createInMemoryTransport())} />);

    const deliveries = screen.getByRole("region", { name: "Deliveries" });
    expect(await within(deliveries).findByText("dlv-1")).toBeInTheDocument();
    expect(within(deliveries).getByText("dlv-2")).toBeInTheDocument();
    expect(within(deliveries).getAllByText("Exhausted")).toHaveLength(2);
  });

  it("retries one delivery and renders the returned row", async () => {
    const user = userEvent.setup();
    const { dependencies } = createDependencies([accepted()]);

    render(<App api={createApi(createInMemoryTransport(dependencies))} />);

    const deliveries = screen.getByRole("region", { name: "Deliveries" });
    const retryRow = (await within(deliveries).findByText("dlv-2")).closest(
      "tr",
    );
    if (retryRow === null) {
      throw new Error("Missing dlv-2 row");
    }

    await user.click(within(retryRow).getByRole("button", { name: "Retry" }));

    expect(await within(retryRow).findByText("Delivered")).toBeInTheDocument();
    expect(within(retryRow).getByText("1")).toBeInTheDocument();
  });
});
