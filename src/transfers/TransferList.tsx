import { useState } from 'react';
import { ErrorMessage } from '../shared/ErrorMessage';
import { formatMoney, formatTime } from '../shared/format';
import { type Transfer } from '../shared/types';
import { useTransfers } from './api';
import { TransferDetail } from './TransferDetail';

export function TransferList() {
  const transfers = useTransfers();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (transfers.isPending) {
    return <p className="muted">Loading transfers…</p>;
  }
  if (transfers.isError) {
    return <ErrorMessage error={transfers.error} />;
  }
  if (transfers.data.length === 0) {
    return <p className="empty">No transfers yet. Send one and watch the saga run.</p>;
  }

  return (
    <ul className="transfer-list" aria-label="Transfers">
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
  return (
    <li className="transfer">
      <button type="button" className="transfer-row" aria-expanded={open} onClick={onToggle}>
        <span className="transfer-parties">
          {transfer.sourceHolder} <span className="muted">to</span> {transfer.destinationHolder}
        </span>
        <span className={`status status-${transfer.status.toLowerCase()}`}>{transfer.status}</span>
        <time className="muted" dateTime={transfer.requestedAt}>
          {formatTime(transfer.requestedAt)}
        </time>
        <span className="amount">{formatMoney(transfer.amount, transfer.currency)}</span>
      </button>
      {open && <TransferDetail transfer={transfer} />}
    </li>
  );
}
