export const priorities = ["urgent", "high", "normal", "low"] as const;

export type Priority = (typeof priorities)[number];
export type Status = "open" | "pending" | "resolved";

export interface Ticket {
  id: string;
  title: string;
  requester: string;
  priority: Priority;
  status: Status;
  updatedAt: string;
}

export interface QueryOptions {
  priority?: Priority;
}
