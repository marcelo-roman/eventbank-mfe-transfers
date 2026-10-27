import { ErrorMessage } from '../shared/ErrorMessage';
import { formatTime } from '../shared/format';
import { useLocale } from '../shared/i18n/LocaleContext';
import { usePixKeys, useRemoveKey } from './api';
import { RegisterKeyForm } from './RegisterKeyForm';

export function KeysPanel() {
  const { locale, t } = useLocale();
  const keys = usePixKeys();
  const remove = useRemoveKey();

  return (
    <div className="split">
      <section aria-labelledby="keys-title">
        <h2 id="keys-title">{t.keys.title}</h2>
        <ErrorMessage error={keys.error ?? remove.error} />
        {keys.data?.length === 0 && <p className="empty">{t.keys.empty}</p>}
        <ul className="key-list">
          {keys.data?.map((key) => (
            <li key={key.key} className="key-row">
              <span className="key-type">{t.keyTypes[key.type]}</span>
              <span className="key-value">{key.key}</span>
              <span className="muted">{formatTime(key.registeredAt, locale)}</span>
              <button
                type="button"
                className="button quiet small"
                disabled={remove.isPending}
                onClick={() => {
                  remove.mutate(key.key);
                }}
              >
                {t.keys.remove}
              </button>
            </li>
          ))}
        </ul>
      </section>
      <aside className="panel">
        <RegisterKeyForm />
      </aside>
    </div>
  );
}
