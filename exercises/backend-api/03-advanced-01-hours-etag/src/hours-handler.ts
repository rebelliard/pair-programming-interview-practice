import type { HoursStore } from './hours-store';

export type HoursHandler = {
  get: (request: Request) => Promise<Response>;
  put: (request: Request) => Promise<Response>;
};

export function createHoursHandler(_store: HoursStore): HoursHandler {
  return {
    async get(_request) {
      return Response.json(
        { error: { code: 'not_implemented' } },
        { status: 501 },
      );
    },
    async put(_request) {
      return Response.json(
        { error: { code: 'not_implemented' } },
        { status: 501 },
      );
    },
  };
}
