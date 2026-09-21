import { createMenuResponse } from "../../../src/menu";

export function GET(request: Request): Response {
  return createMenuResponse(request);
}
