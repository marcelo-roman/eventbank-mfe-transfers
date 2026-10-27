interface Problem {
  detail?: string;
  code?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;
  readonly detail: string | undefined;

  constructor(status: number, detail?: string, code?: string) {
    super(detail ?? `The server answered ${status}.`);
    this.status = status;
    this.detail = detail;
    this.code = code;
  }
}

let tokenProvider: (() => Promise<string>) | null = null;

export function configureApi(getAccessToken: () => Promise<string>): void {
  tokenProvider = getAccessToken;
}

async function headers(): Promise<Record<string, string>> {
  const token = tokenProvider ? await tokenProvider() : null;
  return token
    ? { 'content-type': 'application/json', authorization: `Bearer ${token}` }
    : { 'content-type': 'application/json' };
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, { ...init, headers: await headers() });
  const text = await response.text();

  if (!response.ok) {
    const problem = parse(text) as Problem | undefined;
    throw new ApiError(response.status, problem?.detail, problem?.code);
  }

  return parse(text) as T;
}

export function get<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: body === undefined ? null : JSON.stringify(body) });
}

export function put<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'PUT', body: JSON.stringify(body) });
}

export function del<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'DELETE' });
}

export async function findOrNull<T>(path: string): Promise<T | null> {
  try {
    return await get<T>(path);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

function parse(text: string): unknown {
  if (!text) {
    return undefined;
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}
