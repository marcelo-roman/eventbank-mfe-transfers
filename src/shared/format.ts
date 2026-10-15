const formatters = new Map<string, Intl.NumberFormat>();

export function formatMoney(amount: number, currency: string): string {
  let formatter = formatters.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency, currencyDisplay: 'code' });
    formatters.set(currency, formatter);
  }
  return formatter.format(amount);
}

export function formatSigned(amount: number, currency: string): string {
  const formatted = formatMoney(Math.abs(amount), currency);
  return amount < 0 ? `−${formatted}` : `+${formatted}`;
}

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

export function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso));
}

export function shortId(id: string): string {
  return id.slice(-8);
}

const reasons: Record<string, string> = {
  insufficient_funds: 'insufficient funds',
  account_closed: 'account closed',
  currency_mismatch: 'currency mismatch',
};

export function describeReason(reason: string | null): string {
  if (!reason) {
    return '';
  }
  return reasons[reason] ?? reason.replaceAll('_', ' ');
}
