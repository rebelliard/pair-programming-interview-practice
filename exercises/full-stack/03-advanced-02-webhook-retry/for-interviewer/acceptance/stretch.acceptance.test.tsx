import { render, screen } from "@testing-library/react";
import { Component, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { App } from "../../src/client/App";
import { createApi } from "../../src/client/api";
import type { Transport } from "../../src/shared/api";
import { seedDeliveries } from "../../test/fixtures";

class StatusBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

describe("stretch acceptance: already delivered badge", () => {
  it("renders an Already delivered badge", async () => {
    const transport: Transport = async () => ({
      status: 200,
      body: {
        deliveries: [
          {
            ...seedDeliveries[0],
            status: "already_delivered",
          },
        ],
      },
    });

    render(
      <StatusBoundary>
        <App api={createApi(transport)} />
      </StatusBoundary>,
    );

    expect(await screen.findByText("Already delivered")).toBeInTheDocument();
  });
});
