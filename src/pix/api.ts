import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { del, get, post } from '../shared/api';
import {
  type CommandResult,
  type CustomerProfile,
  type PixKey,
  type PixKeyType,
  type PixLookup,
} from '../shared/types';
import { transferKeys } from '../transfers/api';

const keysKey = ['pix-keys'] as const;

export function usePixKeys() {
  return useQuery({ queryKey: keysKey, queryFn: () => get<PixKey[]>('/pix/keys') });
}

export function useProfile() {
  return useQuery({ queryKey: ['profile'], queryFn: () => get<CustomerProfile>('/customers/me'), staleTime: Infinity });
}

export function useLookup() {
  return useMutation({
    mutationFn: (key: string) => get<PixLookup>(`/pix/keys/lookup?key=${encodeURIComponent(key)}`),
  });
}

async function waitForKeys(predicate: (keys: PixKey[]) => boolean): Promise<void> {
  for (let attempt = 0; attempt < 30; attempt++) {
    if (predicate(await get<PixKey[]>('/pix/keys'))) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
}

export function useRegisterKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { accountId: string; type: PixKeyType; value: string }) => {
      const before = (await get<PixKey[]>('/pix/keys')).length;
      const result = await post<CommandResult>('/pix/keys', input);
      await waitForKeys((keys) => keys.length > before);
      return result;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keysKey }),
  });
}

export function useRemoveKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (key: string) => {
      await del<CommandResult>(`/pix/keys/${encodeURIComponent(key)}`);
      await waitForKeys((keys) => !keys.some((existing) => existing.key === key));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keysKey }),
  });
}

async function waitForTransfer(id: string): Promise<void> {
  for (let attempt = 0; attempt < 30; attempt++) {
    const transfers = await get<{ id: string }[]>('/transfers');
    if (transfers.some((transfer) => transfer.id === id)) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
}

export function useSendPix() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { sourceAccountId: string; key: string; amount: number }) => {
      const result = await post<CommandResult>('/pix/transfers', input);
      await waitForTransfer(result.id);
      return result;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transferKeys.all }),
  });
}
