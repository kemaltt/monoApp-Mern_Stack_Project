import { Link, useNavigate } from "react-router-dom";
import Guy from "../assets/images/Guy.png";
import Coin from "../assets/images/Coin.png";
import Donut from "../assets/images/Donut.png";
import { FormattedMessage } from "react-intl";
import { useIntl } from "../context/IntlContext";
import { MdLanguage } from "react-icons/md";
import { useState } from "react";

const Onboarding = () => {
  const navigate = useNavigate();
  const { locale, switchLanguage } = useIntl();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'de', label: 'DE', flag: '🇩🇪' },
    { code: 'tr', label: 'TR', flag: '🇹🇷' },
  ];

  const currentLanguage = languages.find(lang => lang.code === locale);

  return (
    <div className="min-h-screen bg-cover bg-no-repeat bg-[position:0_-30vh] px-[8%] flex flex-col justify-between lg:flex-row lg:items-center lg:justify-center lg:px-16 lg:gap-16 relative" 
         style={{ backgroundImage: "url('../assets/images/lightBlueBackground.png')" }}>
      
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-50 lg:top-8 lg:right-8">
        <div className="relative">
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 lg:px-5 lg:py-3"
          >
            <MdLanguage className="w-5 h-5 lg:w-6 lg:h-6 text-darkBlue" />
            <span className="text-sm lg:text-base font-semibold text-gray-700">{currentLanguage?.label}</span>
            <span className="text-lg">{currentLanguage?.flag}</span>
          </button>
          
          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl overflow-hidden">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    switchLanguage(lang.code);
                    setIsLangOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                    locale === lang.code ? 'bg-blue-50 text-darkBlue font-semibold' : 'text-gray-700'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-sm">{lang.label}</span>
                  {locale === lang.code && <span className="ml-auto">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="relative mt-16 lg:mt-0 lg:flex-1 lg:max-w-xl">
        <img src={Coin} alt="coin" className="absolute w-16 top-0 left-0 animate-[spin_3s_linear_infinite] lg:w-24" />
        <img src={Donut} alt="donut" className="absolute w-16 top-0 right-0 animate-[spin_4s_linear_infinite_reverse] lg:w-24" />
        <img src={Guy} alt="the määän" className="w-full max-w-[300px] mx-auto relative z-10 animate-[guy_3s_infinite_ease-in-out] lg:max-w-[400px]" />
      </div>
      <div className="pb-16 lg:pb-0 lg:flex-1 lg:max-w-xl lg:text-left">
        <h1 className="text-4xl lg:text-6xl font-bold mb-2"><FormattedMessage id="onboarding.spendSmarter" /></h1>
        <h1 className="text-4xl lg:text-6xl font-bold mb-8"><FormattedMessage id="onboarding.saveMore" /></h1>
        <button 
          onClick={() => navigate("/login")}
          className="bg-gradient-blue border-none py-4 rounded-[50px] text-white text-lg font-semibold w-full lg:w-auto lg:px-16 lg:text-xl hover:bg-gradient-blue-reverse transition-all duration-300 mb-4"
        >
          <FormattedMessage id="onboarding.getStarted" />
        </button>
        <p className="text-sm lg:text-base">
          <FormattedMessage id="auth.noAccount" />{" "}
          <Link to="/signup" className="no-underline text-darkBlue hover:underline font-medium">
            <FormattedMessage id="auth.signup" />
          </Link>
        </p>
      </div>

      <style jsx>{`
        @keyframes guy {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
