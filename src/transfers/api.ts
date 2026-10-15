import { useQuery } from '@tanstack/react-query';
import { get } from '../shared/api';
import { type AccountSummary, type StoredEvent, type Transfer, type TransferStatus } from '../shared/types';

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

export function useAccounts() {
  return useQuery({ queryKey: ['accounts'], queryFn: () => get<AccountSummary[]>('/accounts') });
}
