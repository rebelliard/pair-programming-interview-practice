export type HttpMethod = "GET" | "POST";

export interface ApiRequest {
  method: HttpMethod;
  path: string;
  query: Record<string, string | undefined>;
  headers: Record<string, string>;
  body?: unknown;
}

export interface ApiResponse<TBody = unknown> {
  status: number;
  body?: TBody;
}

export type Transport = (request: ApiRequest) => Promise<ApiResponse>;
