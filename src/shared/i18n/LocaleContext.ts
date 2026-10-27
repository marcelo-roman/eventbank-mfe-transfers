import { createContext, useContext } from 'react';
import { type Locale } from './locale';
import { messages, type Messages } from './messages';

export const LocaleContext = createContext<Locale>('en');

export function useLocale(): { locale: Locale; t: Messages } {
  const locale = useContext(LocaleContext);
  return { locale, t: messages[locale] };
}
