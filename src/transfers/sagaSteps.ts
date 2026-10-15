import { describeReason } from '../shared/format';
import { type Transfer } from '../shared/types';

export type StepState = 'done' | 'failed' | 'waiting';

export interface SagaStep {
  label: string;
  state: StepState;
}

export function sagaSteps(transfer: Transfer): SagaStep[] {
  const reason = describeReason(transfer.failureReason);
  const requested: SagaStep = { label: `Requested by ${transfer.sourceHolder}`, state: 'done' };
  const debited: SagaStep = { label: `Debited from ${transfer.sourceHolder}`, state: 'done' };

  switch (transfer.status) {
    case 'Requested':
      return [requested, { label: `Waiting for ${transfer.sourceHolder} to be debited`, state: 'waiting' }];
    case 'Failed':
      return [requested, { label: `Debit declined: ${reason}`, state: 'failed' }];
    case 'Debited':
      return [
        requested,
        debited,
        { label: `Waiting for ${transfer.destinationHolder} to be credited`, state: 'waiting' },
      ];
    case 'Completed':
      return [requested, debited, { label: `Credited to ${transfer.destinationHolder}`, state: 'done' }];
    case 'Reversing':
      return [
        requested,
        debited,
        { label: `Credit declined: ${reason}`, state: 'failed' },
        { label: `Waiting for the refund to ${transfer.sourceHolder}`, state: 'waiting' },
      ];
    case 'Reversed':
      return [
        requested,
        debited,
        { label: `Credit declined: ${reason}`, state: 'failed' },
        { label: `Refunded to ${transfer.sourceHolder}`, state: 'done' },
      ];
  }
}
