import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from './locales/en/common.json';
import viCommon from './locales/vi/common.json';

export const LOCALE_STORAGE_KEY = 'nxh_locale_v1';
export const DEFAULT_LANGUAGE = 'en';
export const SUPPORTED_LANGUAGES = ['en', 'vi'];

const getUrlLanguage = () => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  return /^\/vi(?:\/|$)/i.test(window.location.pathname) ? 'vi' : DEFAULT_LANGUAGE;
};

const normalizeLanguage = (language) => (
  SUPPORTED_LANGUAGES.includes(language?.split('-')[0])
    ? language.split('-')[0]
    : DEFAULT_LANGUAGE
);

const syncDocumentLanguage = (language) => {
  const normalizedLanguage = normalizeLanguage(language);

  if (typeof document !== 'undefined') {
    document.documentElement.lang = normalizedLanguage;
  }

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, normalizedLanguage);
    } catch {
      // Language selection still works when storage is unavailable.
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon },
      vi: { common: viCommon },
    },
    lng: getUrlLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

syncDocumentLanguage(i18n.resolvedLanguage || i18n.language);
i18n.on('languageChanged', syncDocumentLanguage);

export default i18n;
