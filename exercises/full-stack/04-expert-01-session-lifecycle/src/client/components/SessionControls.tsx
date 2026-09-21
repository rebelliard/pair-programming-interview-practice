import type { Command, Session, SessionStatus } from "../../shared/sessions";
import { COMMANDS, isTerminal } from "../../shared/transitions";
import type { Api } from "../api";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

function commandLabel(command: Command): string {
  switch (command) {
    case "start":
      return "Start";
    case "pause":
      return "Pause";
    case "resume":
      return "Resume";
    case "end":
      return "End";
    case "cancel":
      return "Cancel";
    default: {
      const unreachable: never = command;
      throw new Error(`Unhandled command: ${unreachable}`);
    }
  }
}

function isCommandEnabled(status: SessionStatus, command: Command): boolean {
  switch (command) {
    case "start":
      return status === "scheduled";
    case "pause":
      return status === "live";
    case "resume":
      return !isTerminal(status);
    case "end":
      return status === "live" || status === "paused";
    case "cancel":
      return !isTerminal(status);
    default: {
      const unreachable: never = command;
      throw new Error(`Unhandled command: ${unreachable}`);
    }
  }
}

export function SessionControls({
  api,
  session,
  onSessionChange,
}: {
  api: Api;
  session: Session;
  onSessionChange: (session: Session) => void;
}) {
  async function handleCommand(command: Command) {
    const result = await api.applyCommand(session.id, command);

    if (result.ok) {
      onSessionChange(result.session);
    }
  }

  return (
    <div className={cn("flex", "flex-wrap", "gap-2")}>
      {COMMANDS.map((command) => (
        <Button
          key={command}
          type="button"
          disabled={!isCommandEnabled(session.status, command)}
          onClick={() => {
            void handleCommand(command);
          }}
        >
          {commandLabel(command)}
        </Button>
      ))}
    </div>
  );
}
