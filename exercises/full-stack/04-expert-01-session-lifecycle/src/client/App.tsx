import { useEffect, useState } from "react";
import type { Session } from "../shared/sessions";
import type { Api } from "./api";
import { SessionControls } from "./components/SessionControls";
import { Badge } from "./components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Label } from "./components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "./components/ui/native-select";
import { cn } from "./lib/utils";

export function App({ api }: { api: Api }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [session, setSession] = useState<Session | undefined>(undefined);

  useEffect(() => {
    let isCurrent = true;

    async function loadSessions() {
      const nextSessions = await api.listSessions();

      if (isCurrent) {
        setSessions(nextSessions);
        setSelectedId((current) => {
          if (
            current !== undefined &&
            nextSessions.some((listedSession) => listedSession.id === current)
          ) {
            return current;
          }

          return nextSessions[0]?.id;
        });
      }
    }

    void loadSessions();

    return () => {
      isCurrent = false;
    };
  }, [api]);

  useEffect(() => {
    if (selectedId === undefined) {
      return;
    }

    const id = selectedId;
    let isCurrent = true;

    async function loadSession() {
      const nextSession = await api.getSession(id);

      if (isCurrent) {
        setSession(nextSession);
      }
    }

    void loadSession();

    return () => {
      isCurrent = false;
    };
  }, [api, selectedId]);

  return (
    <main className={cn("grid", "gap-6", "p-6")}>
      <div className={cn("flex", "items-center", "gap-2")}>
        <Label htmlFor="session">Session</Label>
        <NativeSelect
          id="session"
          value={selectedId ?? ""}
          onChange={(event) => setSelectedId(event.target.value)}
        >
          {sessions.map((listedSession) => (
            <NativeSelectOption key={listedSession.id} value={listedSession.id}>
              {listedSession.id}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      {session ? (
        <Card>
          <CardHeader>
            <CardTitle>Session</CardTitle>
          </CardHeader>
          <CardContent className={cn("grid", "gap-4")}>
            <Badge>{session.status}</Badge>
            <SessionControls
              api={api}
              session={session}
              onSessionChange={setSession}
            />
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}
