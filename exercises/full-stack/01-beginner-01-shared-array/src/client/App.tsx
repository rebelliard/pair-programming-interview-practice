import { useEffect, useState } from "react";
import type { Ticket } from "../shared/tickets";
import type { Api } from "./api";
import { Badge } from "./components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Label } from "./components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "./components/ui/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { cn } from "./lib/utils";

function compareByMostRecent(left: Ticket, right: Ticket): number {
  return right.updatedAt.localeCompare(left.updatedAt);
}

function TicketQueue({ tickets }: { tickets: Ticket[] }) {
  return (
    <Card role="region" aria-labelledby="priority-queue-title">
      <CardHeader>
        <CardTitle id="priority-queue-title">Priority queue</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>
                  <Badge>{ticket.priority}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function RecentActivity({ tickets }: { tickets: Ticket[] }) {
  const recentTickets = tickets.sort(compareByMostRecent);

  return (
    <Card role="region" aria-labelledby="recent-activity-title">
      <CardHeader>
        <CardTitle id="recent-activity-title">Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{ticket.updatedAt.slice(0, 10)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PriorityFilter({
  priority,
  onPriorityChange,
}: {
  priority: string;
  onPriorityChange: (priority: string) => void;
}) {
  return (
    <div className={cn("flex", "items-center", "gap-2")}>
      <Label htmlFor="priority">Priority</Label>
      <NativeSelect
        id="priority"
        value={priority}
        onChange={(event) => onPriorityChange(event.target.value)}
      >
        <NativeSelectOption value="">All priorities</NativeSelectOption>
        <NativeSelectOption value="urgent">Urgent</NativeSelectOption>
        <NativeSelectOption value="high">High</NativeSelectOption>
        <NativeSelectOption value="normal">Normal</NativeSelectOption>
        <NativeSelectOption value="low">Low</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}

export function App({ api }: { api: Api }) {
  const [priority, setPriority] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    let isCurrent = true;

    async function loadTickets() {
      const nextTickets = await api.listTickets({
        priority: priority || undefined,
      });

      if (isCurrent) {
        setTickets(nextTickets);
      }
    }

    void loadTickets();

    return () => {
      isCurrent = false;
    };
  }, [api, priority]);

  return (
    <main className={cn("grid", "gap-6", "p-6")}>
      <PriorityFilter priority={priority} onPriorityChange={setPriority} />
      <RecentActivity tickets={tickets} />
      <TicketQueue tickets={tickets} />
    </main>
  );
}
