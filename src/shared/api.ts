interface Problem {
  detail?: string;
  code?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: { 'content-type': 'application/json' },
  });
  const text = await response.text();

  if (!response.ok) {
    const problem = parse(text) as Problem | undefined;
    throw new ApiError(problem?.detail ?? `The server answered ${response.status}.`, response.status, problem?.code);
  }

  return parse(text) as T;
}

export function get<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: body === undefined ? null : JSON.stringify(body) });
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
