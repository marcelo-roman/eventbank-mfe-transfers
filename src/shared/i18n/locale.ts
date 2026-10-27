export type Locale = 'en' | 'pt-BR';

const locales: Locale[] = ['en', 'pt-BR'];

const storageKey = 'eventbank.locale';

const intlLocales: Record<Locale, string> = { en: 'en-US', 'pt-BR': 'pt-BR' };

function localeOf(language: string): Locale | null {
  const normalized = language.toLowerCase();
  if (normalized.startsWith('pt')) {
    return 'pt-BR';
  }
  if (normalized.startsWith('en')) {
    return 'en';
  }
  return null;
}

function storedLocale(): Locale | null {
  try {
    const stored = window.localStorage.getItem(storageKey);
    return locales.find((locale) => locale === stored) ?? null;
  } catch {
    return null;
  }
}

export function detectLocale(): Locale {
  const stored = storedLocale();
  if (stored) {
    return stored;
  }
  const languages = navigator.languages.length > 0 ? navigator.languages : [navigator.language];
  for (const language of languages) {
    const locale = localeOf(language);
    if (locale) {
      return locale;
    }
  }
  return 'en';
}

export function intlLocale(locale: Locale): string {
  return intlLocales[locale];
}
