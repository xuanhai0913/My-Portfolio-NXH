import i18n from '../../i18n';
import enHome from '../../i18n/locales/en/home.json';
import viHome from '../../i18n/locales/vi/home.json';

const homeResources = {
  en: enHome,
  vi: viHome,
};

Object.entries(homeResources).forEach(([language, resources]) => {
  if (!i18n.hasResourceBundle(language, 'home')) {
    i18n.addResourceBundle(language, 'home', resources, true, true);
  }
});
