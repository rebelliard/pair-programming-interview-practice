import { describe, expect, it } from "vitest";
import { applyCommand } from "../../src/server/sessions/apply-command";
import { accepted, rejected, sessionIn } from "../../test/fixtures";

describe("resume regression acceptance", () => {
  it("rejects resume from a scheduled session", () => {
    expect(applyCommand(sessionIn("scheduled"), "resume")).toEqual(
      rejected("scheduled", "resume"),
    );
  });

  it("rejects resume from a live session", () => {
    expect(applyCommand(sessionIn("live"), "resume")).toEqual(
      rejected("live", "resume"),
    );
  });

  it("resumes only a paused session", () => {
    expect(applyCommand(sessionIn("paused"), "resume")).toEqual(
      accepted("live"),
    );
  });

  it("keeps terminal resume rejections", () => {
    expect(applyCommand(sessionIn("ended"), "resume")).toEqual(
      rejected("ended", "resume"),
    );
    expect(applyCommand(sessionIn("cancelled"), "resume")).toEqual(
      rejected("cancelled", "resume"),
    );
  });

  it("does not change a rejected input", () => {
    const session = Object.freeze(sessionIn("scheduled"));

    applyCommand(session, "resume");

    expect(session).toEqual(sessionIn("scheduled"));
  });

  it("does not change other legal transitions", () => {
    expect(applyCommand(sessionIn("scheduled"), "start")).toEqual(
      accepted("live"),
    );
    expect(applyCommand(sessionIn("live"), "pause")).toEqual(
      accepted("paused"),
    );
    expect(applyCommand(sessionIn("paused"), "end")).toEqual(accepted("ended"));
    expect(applyCommand(sessionIn("live"), "cancel")).toEqual(
      accepted("cancelled"),
    );
  });
});
