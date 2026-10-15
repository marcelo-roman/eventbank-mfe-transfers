import { ErrorMessage } from '../shared/ErrorMessage';
import { formatTime } from '../shared/format';
import { keyTypeLabels, usePixKeys, useRemoveKey } from './api';
import { RegisterKeyForm } from './RegisterKeyForm';

export function KeysPanel() {
  const keys = usePixKeys();
  const remove = useRemoveKey();

  return (
    <div className="split">
      <section aria-labelledby="keys-title">
        <h2 id="keys-title">Your keys</h2>
        <ErrorMessage error={keys.error ?? remove.error} />
        {keys.data?.length === 0 && <p className="empty">No keys yet. Register one so people can pay you.</p>}
        <ul className="key-list">
          {keys.data?.map((key) => (
            <li key={key.key} className="key-row">
              <span className="key-type">{keyTypeLabels[key.type]}</span>
              <span className="key-value">{key.key}</span>
              <span className="muted">{formatTime(key.registeredAt)}</span>
              <button
                type="button"
                className="button quiet small"
                disabled={remove.isPending}
                onClick={() => {
                  remove.mutate(key.key);
                }}
              >
                Remove
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
