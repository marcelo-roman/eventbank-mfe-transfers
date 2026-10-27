import { useState } from 'react';
import { ErrorMessage } from '../shared/ErrorMessage';
import { useLocale } from '../shared/i18n/LocaleContext';
import { type AccountSummary, type PixLookup } from '../shared/types';
import { useSendPix } from './api';

interface RecipientConfirmationProps {
  recipient: PixLookup;
  pixKey: string;
  source: AccountSummary;
  onSent: () => void;
}

export function RecipientConfirmation({ recipient, pixKey, source, onSent }: RecipientConfirmationProps) {
  const { t } = useLocale();
  const send = useSendPix();
  const [amount, setAmount] = useState('');

  const confirm = () => {
    send.mutate({ sourceAccountId: source.id, key: pixKey, amount: Number(amount) }, { onSuccess: onSent });
  };

  return (
    <div className="recipient" aria-label={t.recipient.label}>
      <strong>{recipient.ownerName}</strong>
      <span className="muted">
        {recipient.institution}, {t.keyTypes[recipient.type]} {recipient.maskedKey}
      </span>
      <label className="field">
        <span>{t.recipient.amount(source.currency)}</span>
        <input
          type="number"
          inputMode="decimal"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
          }}
        />
      </label>
      <button type="button" className="button primary" disabled={!amount || send.isPending} onClick={confirm}>
        {send.isPending ? t.recipient.sending : t.recipient.send(recipient.ownerName)}
      </button>
      <ErrorMessage error={send.error} />
    </div>
  );
}
