import { intlLocale, type Locale } from './i18n/locale';

const moneyFormatters = new Map<string, Intl.NumberFormat>();
const timeFormatters = new Map<Locale, Intl.DateTimeFormat>();

export function formatMoney(amount: number, currency: string, locale: Locale): string {
  const key = `${locale}:${currency}`;
  let formatter = moneyFormatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(intlLocale(locale), { style: 'currency', currency, currencyDisplay: 'code' });
    moneyFormatters.set(key, formatter);
  }
  return formatter.format(amount);
}

export function formatSigned(amount: number, currency: string, locale: Locale): string {
  const formatted = formatMoney(Math.abs(amount), currency, locale);
  return amount < 0 ? `−${formatted}` : `+${formatted}`;
}

export function formatTime(iso: string, locale: Locale): string {
  let formatter = timeFormatters.get(locale);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(intlLocale(locale), {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    });
    timeFormatters.set(locale, formatter);
  }
  return formatter.format(new Date(iso));
}

export function shortId(id: string): string {
  return id.slice(-8);
}

export function describeReason(reason: string | null, reasons: Record<string, string>): string {
  if (!reason) {
    return '';
  }
  return reasons[reason] ?? reason.replaceAll('_', ' ');
}
