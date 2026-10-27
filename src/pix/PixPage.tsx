import { useState } from 'react';
import { useLocale } from '../shared/i18n/LocaleContext';
import { TransferList } from '../transfers/TransferList';
import { KeysPanel } from './KeysPanel';
import { SendPixForm } from './SendPixForm';

type Tab = 'send' | 'keys';

export function PixPage() {
  const { t } = useLocale();
  const [tab, setTab] = useState<Tab>('send');

  return (
    <div className="page">
      <header className="page-header">
        <h1>{t.pix.title}</h1>
        <p className="lede">{t.pix.lede}</p>
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
          {t.pix.sendTab}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'keys'}
          onClick={() => {
            setTab('keys');
          }}
        >
          {t.pix.keysTab}
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
