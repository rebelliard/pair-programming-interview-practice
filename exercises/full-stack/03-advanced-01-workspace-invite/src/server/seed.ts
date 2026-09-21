import type { Workspace } from "../shared/workspaces";
import { InMemoryWorkspaceRepository } from "./workspaces/workspace-repository";

export const seedWorkspaces: Workspace[] = [
  {
    id: "ws-acme",
    name: "Acme",
    seatLimit: 5,
    members: ["owner@acme.test", "dev@acme.test"],
    invitations: [{ email: "pending@acme.test" }],
  },
  {
    id: "ws-solo",
    name: "Solo",
    seatLimit: 1,
    members: ["solo@solo.test"],
    invitations: [],
  },
  {
    id: "ws-edge",
    name: "Edge",
    seatLimit: 3,
    members: ["a@edge.test", "b@edge.test"],
    invitations: [],
  },
];

export const repository = new InMemoryWorkspaceRepository(seedWorkspaces);
