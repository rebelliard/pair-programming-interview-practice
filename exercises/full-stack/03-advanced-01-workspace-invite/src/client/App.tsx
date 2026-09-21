import { type FormEvent, useEffect, useState } from "react";
import type { Workspace } from "../shared/workspaces";
import type { Api } from "./api";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { cn } from "./lib/utils";

function MembersTable({ members }: { members: string[] }) {
  return (
    <Card role="region" aria-labelledby="members-title">
      <CardHeader>
        <CardTitle id="members-title">Members</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member}>
                <TableCell>{member}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function InvitationsTable({ invitations }: Pick<Workspace, "invitations">) {
  return (
    <Card role="region" aria-labelledby="invitations-title">
      <CardHeader>
        <CardTitle id="invitations-title">Invitations</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.map((invitation) => (
              <TableRow key={invitation.email}>
                <TableCell>{invitation.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function InviteForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: Wire this form to the workspace invitation API.
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite a teammate</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className={cn("flex", "flex-wrap", "items-end", "gap-4")}
          onSubmit={handleSubmit}
        >
          <div className={cn("grid", "gap-2")}>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" />
          </div>
          <Button type="submit">Send invite</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function App({ api }: { api: Api }) {
  const [workspace, setWorkspace] = useState<Workspace | undefined>();

  useEffect(() => {
    let isCurrent = true;

    async function loadWorkspace() {
      const nextWorkspace = await api.getWorkspace("ws-acme");

      if (isCurrent) {
        setWorkspace(nextWorkspace);
      }
    }

    void loadWorkspace();

    return () => {
      isCurrent = false;
    };
  }, [api]);

  if (workspace === undefined) {
    return <main className="p-6">Loading workspace…</main>;
  }

  return (
    <main className={cn("grid", "gap-6", "p-6")}>
      <InviteForm />
      <MembersTable members={workspace.members} />
      <InvitationsTable invitations={workspace.invitations} />
    </main>
  );
}
