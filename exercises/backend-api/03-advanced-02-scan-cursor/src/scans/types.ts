export const scanKinds = ["billing", "security"] as const;

export type ScanKind = (typeof scanKinds)[number];

export interface ScanEvent {
  id: string;
  kind: ScanKind;
  timestamp: string;
}

export interface ScanStore {
  insert(event: ScanEvent): void;
  list(): readonly ScanEvent[];
}

export interface ScansHandler {
  GET(request: Request): Response;
  POST(request: Request): Promise<Response>;
}
