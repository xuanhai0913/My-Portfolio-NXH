import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const VIETNAMESE_PREFIX = '/vi';

const stripLocalePrefix = (pathname) => {
  if (pathname === VIETNAMESE_PREFIX) return '/';
  if (pathname.startsWith(`${VIETNAMESE_PREFIX}/`)) {
    return pathname.slice(VIETNAMESE_PREFIX.length) || '/';
  }
  return pathname || '/';
};

const localizePathname = (pathname, locale) => {
  const unprefixedPath = stripLocalePrefix(pathname);

  if (locale !== 'vi') return unprefixedPath;
  return unprefixedPath === '/'
    ? VIETNAMESE_PREFIX
    : `${VIETNAMESE_PREFIX}${unprefixedPath}`;
};

const splitDestination = (destination) => {
  const match = destination.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
  return {
    pathname: match?.[1] || '/',
    search: match?.[2] || '',
    hash: match?.[3] || '',
  };
};

const useLocaleNavigation = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const locale = location.pathname === VIETNAMESE_PREFIX
    || location.pathname.startsWith(`${VIETNAMESE_PREFIX}/`)
    ? 'vi'
    : 'en';

  const localizePath = (destination, targetLocale = locale) => {
    const { pathname, search, hash } = splitDestination(destination);
    return `${localizePathname(pathname, targetLocale)}${search}${hash}`;
  };

  const changeLocale = (targetLocale) => {
    if (targetLocale !== 'en' && targetLocale !== 'vi') return;

    void i18n.changeLanguage(targetLocale);
    navigate({
      pathname: localizePathname(location.pathname, targetLocale),
      search: location.search,
      hash: location.hash,
    });
  };

  return { locale, localizePath, changeLocale };
};

export default useLocaleNavigation;
