import { useEffect, useState } from "react";
import type { Delivery, DeliveryStatus } from "../shared/webhooks";
import type { Api } from "./api";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";

function StatusBadge({ status }: { status: DeliveryStatus }) {
  switch (status) {
    case "delivered":
      return <Badge>Delivered</Badge>;
    case "rejected":
      return <Badge>Rejected</Badge>;
    case "exhausted":
      return <Badge>Exhausted</Badge>;
    default: {
      const unreachable: never = status;
      throw new Error(`Unhandled delivery status: ${unreachable}`);
    }
  }
}

export function App({ api }: { api: Api }) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    let isCurrent = true;

    async function loadDeliveries() {
      const nextDeliveries = await api.listDeliveries();

      if (isCurrent) {
        setDeliveries(nextDeliveries);
      }
    }

    void loadDeliveries();

    return () => {
      isCurrent = false;
    };
  }, [api]);

  async function handleRetry(id: string): Promise<void> {
    const delivery = await api.retryDelivery(id);

    setDeliveries((currentDeliveries) =>
      currentDeliveries.map((currentDelivery) =>
        currentDelivery.id === delivery.id ? delivery : currentDelivery,
      ),
    );
  }

  return (
    <main className="grid gap-6 p-6">
      <Card role="region" aria-labelledby="deliveries-title">
        <CardHeader>
          <CardTitle id="deliveries-title">Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell>{delivery.id}</TableCell>
                  <TableCell>
                    <StatusBadge status={delivery.status} />
                  </TableCell>
                  <TableCell>{delivery.attempts}</TableCell>
                  <TableCell>
                    <Button onClick={() => void handleRetry(delivery.id)}>
                      Retry
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
