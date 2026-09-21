import type { Delivery } from "../../shared/webhooks";

export interface DeliveryRepository {
  findById(id: string): Delivery | undefined;
  list(): Delivery[];
  save(delivery: Delivery): void;
}

export class InMemoryDeliveryRepository implements DeliveryRepository {
  readonly #deliveries: Delivery[];

  constructor(deliveries: Delivery[]) {
    this.#deliveries = structuredClone(deliveries);
  }

  findById(id: string): Delivery | undefined {
    const delivery = this.#deliveries.find((item) => item.id === id);

    return delivery === undefined ? undefined : structuredClone(delivery);
  }

  list(): Delivery[] {
    return structuredClone(this.#deliveries);
  }

  save(delivery: Delivery): void {
    const index = this.#deliveries.findIndex((item) => item.id === delivery.id);

    if (index === -1) {
      throw new Error(`Unknown delivery: ${delivery.id}`);
    }

    this.#deliveries[index] = structuredClone(delivery);
  }
}
