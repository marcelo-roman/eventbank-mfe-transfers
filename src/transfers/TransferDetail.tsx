import { formatTime, shortId } from '../shared/format';
import { useLocale } from '../shared/i18n/LocaleContext';
import { type Transfer } from '../shared/types';
import { useTransferEvents } from './api';
import { sagaSteps } from './sagaSteps';

export function TransferDetail({ transfer }: { transfer: Transfer }) {
  const { locale, t } = useLocale();
  const events = useTransferEvents(transfer.id, transfer.version);

  return (
    <div className="transfer-detail">
      <ol className="saga" aria-label={t.transfers.sagaSteps}>
        {sagaSteps(transfer, t).map((step) => (
          <li key={step.label} className={`saga-step saga-${step.state}`}>
            {step.label}
          </li>
        ))}
      </ol>
      <div className="transfer-events">
        <p className="side-note">
          {t.transfers.streamEvents} <code>Transfer-…{shortId(transfer.id)}</code>
        </p>
        <ol className="stream compact">
          {events.data?.map((event) => (
            <li key={event.eventId} className="stream-event">
              <div className="stream-event-head">
                <span className="stream-version">v{event.version}</span>
                <span className="stream-type">{event.type}</span>
                <time dateTime={event.recordedAt}>{formatTime(event.recordedAt, locale)}</time>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
