import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "../../src/client/App";
import { createApi } from "../../src/client/api";
import type { ApiResponse, Transport } from "../../src/shared/api";
import { seedDeliveries } from "../../test/fixtures";

afterEach(cleanup);

function createDeferred<T>() {
  let resolve: (value: T) => void = () => {};
  let reject: (reason?: unknown) => void = () => {};
  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve;
    reject = nextReject;
  });

  return { promise, reject, resolve };
}

function createControllableTransport() {
  const retry = createDeferred<ApiResponse>();
  const transport = vi.fn<Transport>((request) => {
    if (request.method === "GET") {
      return Promise.resolve({
        status: 200,
        body: { deliveries: seedDeliveries },
      });
    }

    request.signal?.addEventListener(
      "abort",
      () => {
        retry.reject(
          new DOMException("The operation was aborted", "AbortError"),
        );
      },
      { once: true },
    );

    return retry.promise;
  });

  return { retry, transport };
}

describe("core acceptance: reliable retry UI", () => {
  it("sends one idempotent request while Retry is pending", async () => {
    const user = userEvent.setup();
    const { retry, transport } = createControllableTransport();

    render(<App api={createApi(transport)} />);
    const row = (await screen.findByText("dlv-2")).closest("tr");
    if (row === null) {
      throw new Error("Missing dlv-2 row");
    }
    const button = within(row).getByRole("button", { name: "Retry" });

    await user.dblClick(button);

    expect(button).toBeDisabled();
    expect(transport).toHaveBeenCalledTimes(2);
    expect(transport).toHaveBeenLastCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({ "idempotency-key": "evt-2" }),
        method: "POST",
      }),
    );

    retry.resolve({
      status: 200,
      body: {
        delivery: { ...seedDeliveries[1], attempts: 1, status: "delivered" },
      },
    });

    expect(await within(row).findByText("Delivered")).toBeInTheDocument();
  });

  it("does not render a response that arrives after unmount", async () => {
    const user = userEvent.setup();
    const { retry, transport } = createControllableTransport();
    const { unmount } = render(<App api={createApi(transport)} />);
    const row = (await screen.findByText("dlv-2")).closest("tr");
    if (row === null) {
      throw new Error("Missing dlv-2 row");
    }

    await user.click(within(row).getByRole("button", { name: "Retry" }));
    const retryRequest = transport.mock.calls.find(
      ([request]) => request.method === "POST",
    )?.[0];
    expect(retryRequest?.signal).toBeDefined();

    unmount();
    expect(retryRequest?.signal?.aborted).toBe(true);

    retry.resolve({
      status: 200,
      body: {
        delivery: { ...seedDeliveries[1], attempts: 1, status: "delivered" },
      },
    });
    await Promise.resolve();
  });
});
