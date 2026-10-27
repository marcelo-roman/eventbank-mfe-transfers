import { ApiError } from './api';
import { useLocale } from './i18n/LocaleContext';
import { type Messages } from './i18n/messages';

function describe(error: unknown, t: Messages): string {
  if (!(error instanceof ApiError)) {
    return error instanceof Error ? error.message : t.errors.generic;
  }
  const translated = error.code ? t.errors.codes[error.code] : undefined;
  if (translated) {
    return translated;
  }
  if (error.detail) {
    return error.detail;
  }
  if (error.status === 401) {
    return t.errors.sessionEnded;
  }
  if (error.status === 403) {
    return t.errors.forbidden;
  }
  return t.errors.status(error.status);
}

export function ErrorMessage({ error }: { error: unknown }) {
  const { t } = useLocale();
  if (!error) {
    return null;
  }
  return (
    <p className="error" role="alert">
      {describe(error, t)}
    </p>
  );
}
