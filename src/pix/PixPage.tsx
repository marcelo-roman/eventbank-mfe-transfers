import { useState } from 'react';
import { TransferList } from '../transfers/TransferList';
import { KeysPanel } from './KeysPanel';
import { SendPixForm } from './SendPixForm';

type Tab = 'send' | 'keys';

export function PixPage() {
  const [tab, setTab] = useState<Tab>('send');

  return (
    <div className="page">
      <header className="page-header">
        <h1>PIX</h1>
        <p className="lede">
          A key points to an account. Each key is its own event stream, so two people can never register the same one. A
          PIX runs as a saga: debit you, credit them, refund you if the credit is declined.
        </p>
      </header>
      <div className="tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'send'}
          onClick={() => {
            setTab('send');
          }}
        >
          Send and history
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'keys'}
          onClick={() => {
            setTab('keys');
          }}
        >
          Your keys
        </button>
      </div>
      {tab === 'send' ? (
        <div className="split">
          <TransferList />
          <aside className="panel">
            <SendPixForm />
          </aside>
        </div>
      ) : (
        <KeysPanel />
      )}
    </div>
  );
}
