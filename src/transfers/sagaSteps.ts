import { describeReason } from '../shared/format';
import { type Messages } from '../shared/i18n/messages';
import { type Transfer } from '../shared/types';

export type StepState = 'done' | 'failed' | 'waiting';

export interface SagaStep {
  label: string;
  state: StepState;
}

export function sagaSteps(transfer: Transfer, t: Messages): SagaStep[] {
  const { saga } = t;
  const reason = describeReason(transfer.failureReason, t.reasons);
  const requested: SagaStep = { label: saga.requested(transfer.sourceHolder), state: 'done' };
  const debited: SagaStep = { label: saga.debited(transfer.sourceHolder), state: 'done' };

  switch (transfer.status) {
    case 'Requested':
      return [requested, { label: saga.waitingDebit(transfer.sourceHolder), state: 'waiting' }];
    case 'Failed':
      return [requested, { label: saga.debitDeclined(reason), state: 'failed' }];
    case 'Debited':
      return [requested, debited, { label: saga.waitingCredit(transfer.destinationHolder), state: 'waiting' }];
    case 'Completed':
      return [requested, debited, { label: saga.credited(transfer.destinationHolder), state: 'done' }];
    case 'Reversing':
      return [
        requested,
        debited,
        { label: saga.creditDeclined(reason), state: 'failed' },
        { label: saga.waitingRefund(transfer.sourceHolder), state: 'waiting' },
      ];
    case 'Reversed':
      return [
        requested,
        debited,
        { label: saga.creditDeclined(reason), state: 'failed' },
        { label: saga.refunded(transfer.sourceHolder), state: 'done' },
      ];
  }
}
