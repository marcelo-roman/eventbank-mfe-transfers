import { describe, expect, it } from 'vitest';
import { type Transfer, type TransferStatus } from '../shared/types';
import { sagaSteps } from './sagaSteps';

function transfer(status: TransferStatus, failureReason: string | null = null): Transfer {
  return {
    id: 'transfer-1',
    sourceAccountId: 'source',
    sourceHolder: 'Alice',
    destinationAccountId: 'destination',
    destinationHolder: 'Bob',
    amount: 10,
    currency: 'BRL',
    status,
    failureReason,
    version: 1,
    requestedAt: '2026-10-15T12:00:00Z',
    updatedAt: '2026-10-15T12:00:00Z',
  };
}

describe('sagaSteps', () => {
  it('shows every step done for a completed transfer', () => {
    expect(sagaSteps(transfer('Completed')).map((step) => step.state)).toEqual(['done', 'done', 'done']);
  });

  it('ends on the declined debit when the source cannot pay', () => {
    const steps = sagaSteps(transfer('Failed', 'insufficient_funds'));

    expect(steps.at(-1)).toEqual({ label: 'Debit declined: insufficient funds', state: 'failed' });
  });

  it('shows the compensation after a declined credit', () => {
    const steps = sagaSteps(transfer('Reversed', 'account_closed'));

    expect(steps.map((step) => step.label)).toEqual([
      'Requested by Alice',
      'Debited from Alice',
      'Credit declined: account closed',
      'Refunded to Alice',
    ]);
  });

  it('waits while the destination has not answered', () => {
    expect(sagaSteps(transfer('Debited')).at(-1)?.state).toBe('waiting');
  });
});
