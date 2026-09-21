import { createHoursHandler } from '../../../src/hours-handler';
import { createHoursStore } from '../../../src/hours-store';

const handler = createHoursHandler(createHoursStore());

export async function GET(request: Request): Promise<Response> {
  return handler.get(request);
}

export async function PUT(request: Request): Promise<Response> {
  return handler.put(request);
}
