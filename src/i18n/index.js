import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from './locales/en/common.json';
import viCommon from './locales/vi/common.json';
import enMisc from './locales/en/misc.json';
import viMisc from './locales/vi/misc.json';
import enHome from './locales/en/home.json';
import viHome from './locales/vi/home.json';
import enExperience from './locales/en/experience.json';
import viExperience from './locales/vi/experience.json';
import enProjects from './locales/en/projects.json';
import viProjects from './locales/vi/projects.json';
import enCertifications from './locales/en/certifications.json';
import viCertifications from './locales/vi/certifications.json';
import enContact from './locales/en/contact.json';
import viContact from './locales/vi/contact.json';
import enContent from './locales/en/content.json';
import viContent from './locales/vi/content.json';

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
      en: {
        common: enCommon,
        misc: enMisc,
        home: enHome,
        experience: enExperience,
        projects: enProjects,
        certifications: enCertifications,
        contact: enContact,
        content: enContent,
      },
      vi: {
        common: viCommon,
        misc: viMisc,
        home: viHome,
        experience: viExperience,
        projects: viProjects,
        certifications: viCertifications,
        contact: viContact,
        content: viContent,
      },
    },
    lng: getUrlLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    ns: ['common', 'misc', 'home', 'experience', 'projects', 'certifications', 'contact', 'content'],
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
