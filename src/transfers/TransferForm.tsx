import { type SyntheticEvent, useState } from 'react';
import { ErrorMessage } from '../shared/ErrorMessage';
import { AccountSelect } from './AccountSelect';
import { useAccounts, useRequestTransfer } from './api';

export function TransferForm() {
  const accounts = useAccounts();
  const requestTransfer = useRequestTransfer();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');

  const options = accounts.data ?? [];
  const sourceAccount = options.find((account) => account.id === source);

  const submit = (event: SyntheticEvent) => {
    event.preventDefault();
    requestTransfer.mutate(
      { sourceAccountId: source, destinationAccountId: destination, amount: Number(amount) },
      {
        onSuccess: () => {
          setAmount('');
        },
      },
    );
  };

  return (
    <form className="form" onSubmit={submit}>
      <h2>Send a transfer</h2>
      {options.length < 2 && <p className="muted">Open at least two accounts to send a transfer.</p>}
      <AccountSelect label="From" accounts={options} value={source} onChange={setSource} />
      <AccountSelect label="To" accounts={options} value={destination} onChange={setDestination} />
      <label className="field">
        <span>Amount{sourceAccount ? ` in ${sourceAccount.currency}` : ''}</span>
        <input
          type="number"
          inputMode="decimal"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
          }}
          required
        />
      </label>
      <button type="submit" className="button primary" disabled={requestTransfer.isPending}>
        {requestTransfer.isPending ? 'Sending…' : 'Send transfer'}
      </button>
      <ErrorMessage error={requestTransfer.error} />
      {requestTransfer.isSuccess && (
        <p className="catch-up" role="status">
          Transfer requested. The list follows each step as the services reply.
        </p>
      )}
    </form>
  );
}
