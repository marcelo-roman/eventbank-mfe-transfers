import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { findOrNull, get, post } from '../shared/api';
import { waitForReadModel } from '../shared/consistency';
import {
  type AccountSummary,
  type CommandResult,
  type StoredEvent,
  type Transfer,
  type TransferStatus,
} from '../shared/types';

const settled: TransferStatus[] = ['Completed', 'Failed', 'Reversed'];

export function isSettled(status: TransferStatus): boolean {
  return settled.includes(status);
}

export const transferKeys = {
  all: ['transfers'] as const,
  events: (id: string, version: number) => ['transfers', id, 'events', version] as const,
};

export function useTransfers() {
  return useQuery({
    queryKey: transferKeys.all,
    queryFn: () => get<Transfer[]>('/transfers'),
    refetchInterval: (query) => (query.state.data?.every((transfer) => isSettled(transfer.status)) ? false : 400),
  });
}

export function useTransferEvents(id: string, version: number) {
  return useQuery({
    queryKey: transferKeys.events(id, version),
    queryFn: () => get<StoredEvent[]>(`/transfers/${id}/events`),
  });
}

export interface TransferInput {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
}

export function useRequestTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: TransferInput) => {
      const result = await post<CommandResult>('/transfers', input);
      await waitForReadModel(() => findOrNull<Transfer>(`/transfers/${result.id}`), result.version);
      return result;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transferKeys.all }),
  });
}

export function useAccounts() {
  return useQuery({ queryKey: ['accounts'], queryFn: () => get<AccountSummary[]>('/accounts') });
}
