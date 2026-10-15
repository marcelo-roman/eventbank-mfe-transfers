import { type SyntheticEvent, useState } from 'react';
import { ErrorMessage } from '../shared/ErrorMessage';
import { formatMoney } from '../shared/format';
import { useAccounts } from '../transfers/api';
import { useLookup } from './api';
import { RecipientConfirmation } from './RecipientConfirmation';

export function SendPixForm() {
  const accounts = useAccounts();
  const lookup = useLookup();
  const [source, setSource] = useState('');
  const [key, setKey] = useState('');

  const open = (accounts.data ?? []).filter((account) => account.status === 'Open');
  const sourceAccount = open.find((account) => account.id === source) ?? open[0];

  const findKey = (event: SyntheticEvent) => {
    event.preventDefault();
    lookup.mutate(key.trim());
  };

  return (
    <div className="form">
      <h2>Send a PIX</h2>
      <label className="field">
        <span>From</span>
        <select
          value={sourceAccount?.id ?? ''}
          onChange={(event) => {
            setSource(event.target.value);
          }}
        >
          {open.map((account) => (
            <option key={account.id} value={account.id}>
              {account.branch}/{account.number} ({formatMoney(account.balance, account.currency)})
            </option>
          ))}
        </select>
      </label>
      <form className="form" onSubmit={findKey}>
        <label className="field">
          <span>Key: CPF, e-mail, phone with +55, or random key</span>
          <input
            value={key}
            onChange={(event) => {
              setKey(event.target.value);
              lookup.reset();
            }}
            required
          />
        </label>
        <button type="submit" className="button" disabled={lookup.isPending}>
          {lookup.isPending ? 'Looking up…' : 'Look up key'}
        </button>
      </form>
      <ErrorMessage error={lookup.error} />
      {lookup.data && sourceAccount && (
        <RecipientConfirmation
          recipient={lookup.data}
          pixKey={key.trim()}
          source={sourceAccount}
          onSent={() => {
            setKey('');
            lookup.reset();
          }}
        />
      )}
    </div>
  );
}
