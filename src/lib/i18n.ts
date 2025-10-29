import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './locales';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })
  .catch((err) => {
    console.error('Failed to init i18n', err);
  });

export default i18n;
