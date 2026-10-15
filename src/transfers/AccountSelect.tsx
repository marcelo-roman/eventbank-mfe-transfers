import { formatMoney } from '../shared/format';
import { type AccountSummary } from '../shared/types';

interface AccountSelectProps {
  label: string;
  accounts: AccountSummary[];
  value: string;
  onChange: (accountId: string) => void;
}

function describe(account: AccountSummary): string {
  const balance = formatMoney(account.balance, account.currency);
  return account.status === 'Closed' ? `${account.holder} (closed)` : `${account.holder} (${balance})`;
}

export function AccountSelect({ label, accounts, value, onChange }: AccountSelectProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        required
      >
        <option value="">Choose an account</option>
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {describe(account)}
          </option>
        ))}
      </select>
    </label>
  );
}
