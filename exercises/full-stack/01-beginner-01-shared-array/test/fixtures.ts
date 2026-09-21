import { handle } from "../src/server/handle";
import { createRepository, seedTickets } from "../src/server/seed";
import type { Transport } from "../src/shared/api";

export { createRepository, seedTickets };

export function createInMemoryTransport(
  repository = createRepository(),
): Transport {
  return (request) => handle(request, { repository });
}
