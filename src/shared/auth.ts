import { createContext, useContext } from 'react';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export interface RemoteAuth {
  user: SessionUser;
  getAccessToken: () => Promise<string>;
}

export interface RemoteProps {
  auth: RemoteAuth;
}

export const UserContext = createContext<SessionUser | null>(null);

export function useUser(): SessionUser {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error('useUser must be used inside the remote App.');
  }
  return user;
}

export function isOperator(user: SessionUser): boolean {
  return user.roles.includes('operator');
}
