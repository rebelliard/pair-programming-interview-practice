import { describe, expect, it } from "vitest";
import { handle } from "../../src/server/handle";
import { applyCommand } from "../../src/server/sessions/apply-command";
import { accepted, createRepository, rejected, sessionIn } from "../fixtures";

describe("applyCommand", () => {
  it("starts a scheduled session", () => {
    const session = sessionIn("scheduled");
    const original = structuredClone(session);

    const result = applyCommand(session, "start");

    expect(result).toEqual(accepted("live"));
    expect(result.ok && result.session).not.toBe(session);
    expect(session).toEqual(original);
  });

  it("pauses a live session", () => {
    expect(applyCommand(sessionIn("live"), "pause")).toEqual(
      accepted("paused"),
    );
  });

  it("resumes a paused session", () => {
    expect(applyCommand(sessionIn("paused"), "resume")).toEqual(
      accepted("live"),
    );
  });

  it("rejects resume from terminal sessions", () => {
    expect(applyCommand(sessionIn("ended"), "resume")).toEqual(
      rejected("ended", "resume"),
    );
    expect(applyCommand(sessionIn("cancelled"), "resume")).toEqual(
      rejected("cancelled", "resume"),
    );
  });

  it("ends live and paused sessions and cancels active ones", () => {
    expect(applyCommand(sessionIn("live"), "end")).toEqual(accepted("ended"));
    expect(applyCommand(sessionIn("paused"), "end")).toEqual(accepted("ended"));
    expect(applyCommand(sessionIn("scheduled"), "cancel")).toEqual(
      accepted("cancelled"),
    );
    expect(applyCommand(sessionIn("live"), "cancel")).toEqual(
      accepted("cancelled"),
    );
    expect(applyCommand(sessionIn("paused"), "cancel")).toEqual(
      accepted("cancelled"),
    );
    expect(applyCommand(sessionIn("cancelled"), "cancel")).toEqual(
      rejected("cancelled", "cancel"),
    );
  });
});

describe("session commands handler", () => {
  it("returns invalid_transition with from and command on a 409", async () => {
    const repository = createRepository();

    const rejectedResponse = await handle(
      {
        method: "POST",
        path: "/sessions/ses-ended/commands",
        query: {},
        headers: {},
        body: { command: "resume" },
      },
      { repository },
    );

    expect(rejectedResponse).toEqual({
      status: 409,
      body: {
        error: {
          command: "resume",
          from: "ended",
          kind: "invalid_transition",
        },
      },
    });
  });

  it("applies a legal command through POST /sessions/:id/commands", async () => {
    const repository = createRepository();

    const response = await handle(
      {
        method: "POST",
        path: "/sessions/ses-scheduled/commands",
        query: {},
        headers: {},
        body: { command: "start" },
      },
      { repository },
    );

    expect(response).toEqual({
      status: 200,
      body: {
        session: {
          id: "ses-scheduled",
          presentationId: "presentation-42",
          status: "live",
        },
      },
    });
  });
});
