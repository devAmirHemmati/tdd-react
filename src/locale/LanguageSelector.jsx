import { useTranslation } from 'react-i18next';
import { langsKey } from './i18n';

const LanguageSelector = () => {
  const [_, i18n] = useTranslation(); // eslint-disable-line

  const handleChangeToFarsiLang = () => {
    i18n.changeLanguage(langsKey.fa);
  };

  const handleChangeToEnglishLang = () => {
    i18n.changeLanguage(langsKey.en);
  };

  return (
    <div className="mt-3 d-flex justify-content-center">
      <img
        src="https://www.worldometers.info/img/flags/ir-flag.gif"
        style={{ cursor: 'pointer' }}
        onClick={handleChangeToFarsiLang}
        width="30"
        height="20"
        alt="fa-lang-icon"
      />

      <div style={{ width: 15 }} />

      <img
        src="https://www.worldometers.info/img/flags/as-flag.gif"
        style={{ cursor: 'pointer' }}
        onClick={handleChangeToEnglishLang}
        width="30"
        height="20"
        alt="en-lang-icon"
      />
    </div>
  );
};

export default LanguageSelector;
