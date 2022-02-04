import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fa from './lang/fa.json';
import en from './lang/en.json';

export const langsKey = {
  en: 'en',
  fa: 'fa',
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      [langsKey.en]: {
        translation: en,
      },
      [langsKey.fa]: {
        translation: fa,
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
