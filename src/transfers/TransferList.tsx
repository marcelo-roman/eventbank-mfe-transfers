import { useState } from 'react';
import { ErrorMessage } from '../shared/ErrorMessage';
import { formatMoney, formatTime } from '../shared/format';
import { useLocale } from '../shared/i18n/LocaleContext';
import { type Transfer } from '../shared/types';
import { useTransfers } from './api';
import { TransferDetail } from './TransferDetail';

export function TransferList() {
  const { t } = useLocale();
  const transfers = useTransfers();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (transfers.isPending) {
    return <p className="muted">{t.transfers.loading}</p>;
  }
  if (transfers.isError) {
    return <ErrorMessage error={transfers.error} />;
  }
  if (transfers.data.length === 0) {
    return <p className="empty">{t.transfers.empty}</p>;
  }

  return (
    <ul className="transfer-list" aria-label={t.transfers.label}>
      {transfers.data.map((transfer) => (
        <TransferItem
          key={transfer.id}
          transfer={transfer}
          open={expanded === transfer.id}
          onToggle={() => {
            setExpanded(expanded === transfer.id ? null : transfer.id);
          }}
        />
      ))}
    </ul>
  );
}

function TransferItem({ transfer, open, onToggle }: { transfer: Transfer; open: boolean; onToggle: () => void }) {
  const { locale, t } = useLocale();
  return (
    <li className="transfer">
      <button type="button" className="transfer-row" aria-expanded={open} onClick={onToggle}>
        <span className="transfer-parties">
          {transfer.sourceHolder} <span className="muted">{t.transfers.to}</span> {transfer.destinationHolder}
        </span>
        <span className={`status status-${transfer.status.toLowerCase()}`}>
          {t.transfers.statuses[transfer.status]}
        </span>
        <time className="muted" dateTime={transfer.requestedAt}>
          {formatTime(transfer.requestedAt, locale)}
        </time>
        <span className="amount">{formatMoney(transfer.amount, transfer.currency, locale)}</span>
      </button>
      {open && <TransferDetail transfer={transfer} />}
    </li>
  );
}
