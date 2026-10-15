import { type RemoteAuth } from './auth';

const tokenKey = 'eventbank.devToken';

interface Claims {
  sub?: string;
  name?: string;
  email?: string;
  realm_access?: { roles?: string[] };
}

function claims(token: string): Claims {
  const payload = token.split('.')[1];
  return payload ? (JSON.parse(atob(payload.replaceAll('-', '+').replaceAll('_', '/'))) as Claims) : {};
}

export function standaloneAuth(): RemoteAuth {
  const token = localStorage.getItem(tokenKey) ?? '';
  const payload = claims(token);
  return {
    user: {
      id: payload.sub ?? '',
      name: payload.name ?? 'Standalone user',
      email: payload.email ?? '',
      roles: payload.realm_access?.roles ?? [],
    },
    getAccessToken: () => Promise.resolve(token),
  };
}
