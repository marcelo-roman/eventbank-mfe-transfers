export interface CommandResult {
  id: string;
  version: number;
}

export type AccountStatus = 'Open' | 'Closed';

export interface AccountSummary {
  id: string;
  ownerId: string;
  holder: string;
  branch: string;
  number: string;
  currency: string;
  balance: number;
  status: AccountStatus;
  version: number;
  openedAt: string;
  updatedAt: string;
}

export interface StoredEvent {
  eventId: string;
  version: number;
  globalPosition: number;
  type: string;
  data: Record<string, unknown>;
  recordedAt: string;
}

export type TransferStatus = 'Requested' | 'Debited' | 'Completed' | 'Failed' | 'Reversing' | 'Reversed';

export interface Transfer {
  id: string;
  sourceAccountId: string;
  sourceHolder: string;
  destinationAccountId: string;
  destinationHolder: string;
  amount: number;
  currency: string;
  status: TransferStatus;
  failureReason: string | null;
  version: number;
  requestedAt: string;
  updatedAt: string;
}

export type PixKeyType = 'Cpf' | 'Email' | 'Phone' | 'Random';

export interface PixKey {
  key: string;
  type: PixKeyType;
  maskedKey: string;
  accountId: string;
  registeredAt: string;
}

export interface PixLookup {
  maskedKey: string;
  type: PixKeyType;
  ownerName: string;
  institution: string;
}

export interface CustomerProfile {
  cpf: string;
  email: string;
}
