import { Link, useNavigate } from "react-router-dom";
import userprofile from "../assets/images/userProfile.png";
import lock from "../assets/images/lock.png";
import Nav from "../components/common/Nav";
import { apiBaseUrl } from "../api/api";
import { motion } from "framer-motion";
import TopMobileBar from "../components/common/TopMobileBar";
import { useSelector } from "react-redux";
import { useGetTransactionsMutation } from "../redux/transaction/transaction-api";
import { useEffect, useState } from "react";
import { useLogoutMutation } from "../redux/auth/auth-api";
import { FormattedMessage } from "react-intl";
import { useIntl } from "../context/IntlContext";
import { MdLanguage, MdExpandMore } from "react-icons/md";
import ThemeToggle from "../components/common/ThemeToggle";

const Profile = () => {
  const navigate = useNavigate();
  const [getTransactions] = useGetTransactionsMutation();
  const [logout] = useLogoutMutation();
  const { transactions } = useSelector((state) => state.transactions);
  const { locale, switchLanguage } = useIntl();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  ];

  const currentLanguage = languages.find(lang => lang.code === locale);

  useEffect(() => {
    const getAllTransactions = async () => {
        await getTransactions();
    }
    getAllTransactions();
  }, [getTransactions]);
  
  const logOut = async () => {
    await logout().unwrap();

    localStorage.removeItem('token');
    navigate("/onboarding");
  };

  return (
    transactions && (
      <div className="dark:bg-gray-900 min-h-screen">
        <div className="min-h-screen lg:flex lg:justify-center lg:items-start lg:pt-8 lg:pr-20">
          <div className="lg:max-w-4xl lg:w-full">
            <div className="bg-gradient-blue rounded-b-[20px] h-[25vh] lg:h-[30vh] lg:rounded-[30px]">
              <TopMobileBar />
              <h4 className="text-white text-center pt-12 lg:pt-16 lg:text-2xl font-semibold"><FormattedMessage id="nav.profile" /></h4>
            </div>
            <motion.div
              initial={{ y: "100vh" }}
              animate={{
                opacity: [0, 0.5, 1],
                y: [100, 0, 0],
              }}
              transition={{
                type: "twin",
                duration: 0.5,
                delay: 2 / 10,
              }}
              className="flex justify-center -mt-16 lg:-mt-20"
            >
              <img
                src={
                  transactions.profile_image?.startsWith("http")
                    ? transactions.profile_image
                    : `${apiBaseUrl}/${transactions.profile_image}`
                }
                alt={transactions.profile_image}
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-white shadow-lg object-cover"
              />
            </motion.div>
            <h2 className="text-center text-black text-2xl lg:text-3xl font-semibold mt-4">{transactions.name}</h2>
            <p className="text-center text-gray-500 text-sm lg:text-base mb-8">{transactions.email}</p>
            <div className="px-[5%] lg:px-8 pb-24 lg:pb-8">
              <Link to="/edit-profile" className="no-underline">
                <p className="flex items-center gap-4 py-4 px-4 my-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow lg:py-5 lg:text-lg">
                  <img src={userprofile} alt="profile icon" className="w-6 h-6 lg:w-7 lg:h-7" />
                  <span className="text-gray-700"><FormattedMessage id="profile.accountInfo" /></span>
                </p>
              </Link>

              {/* Language Selector */}
              <div className="my-2">
                <div 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center justify-between py-4 px-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer lg:py-5 lg:text-lg"
                >
                  <div className="flex items-center gap-4">
                    <MdLanguage className="w-6 h-6 lg:w-7 lg:h-7 text-darkBlue" />
                    <span className="text-gray-700"><FormattedMessage id="profile.language" /></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{currentLanguage?.flag}</span>
                    <span className="text-sm text-gray-600">{currentLanguage?.label}</span>
                    <MdExpandMore className={`w-5 h-5 text-gray-400 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                
                {isLangOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          switchLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                          locale === lang.code ? 'bg-blue-50 dark:bg-gray-700 border-l-4 border-darkBlue' : ''
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className={`text-sm ${
                          locale === lang.code ? 'text-darkBlue font-semibold' : 'text-gray-700 dark:text-gray-200'
                        }`}>{lang.label}</span>
                        {locale === lang.code && <span className="ml-auto text-darkBlue">✓</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
              
              <p onClick={logOut} className="flex items-center gap-4 py-4 px-4 my-2 bg-red-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer lg:py-5 lg:text-lg">
                <img src={lock} alt="lock" className="w-6 h-6 lg:w-7 lg:h-7" />
                <span className="text-red-600 font-medium"><FormattedMessage id="profile.logout" /></span>
              </p>
            </div>
          </div>
        </div>
        <Nav />
      </div>
    )
  );
};

export default Profile;
