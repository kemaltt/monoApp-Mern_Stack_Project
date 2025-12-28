import BarChart from "../components/charts/BarChart";
import { useEffect, useState } from "react";
import Nav from "../components/common/Nav";
import Vector from "../assets/images/Vector.png";
import left from "../assets/images/ArrowLeft.png";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGetTransactionsMutation } from "../redux/transaction/transaction-api";
import { useSelector } from "react-redux";
import SkeletonLoader from "../components/common/SkeletonLoader";
import { FormattedMessage, useIntl } from "react-intl";
// import TopMobileBar from "../components/TopMobileBar";

const Statistic = () => {

  const intl = useIntl();
  const [getTransactions, { isLoading }] = useGetTransactionsMutation();
  const { transactions } = useSelector((state) => state.transactions);
  const [timeRange, setTimeRange] = useState(7); // Neue State für Zeitraum

  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  // Toplam işlemi için genel bir fonksiyon
  const sum = (accumulator, curr) => accumulator + curr;
  const hours24 = 86400000;

  // Belirli bir gün için gelir ve gider hesaplama fonksiyonu
  const calculateIncomeExpenses = (transactions, dayIdx) => {
    const currentTime = Date.now();
    const startOfDay = currentTime - hours24 * (dayIdx + 1);
    const endOfDay = currentTime - hours24 * dayIdx;

    const transactionsOfDay = transactions?.filter(
      (t) => t.createdAt > startOfDay && t.createdAt < endOfDay
    ) || [];

    const income = transactionsOfDay
      .filter((t) => t.income)
      .map((t) => t.amount)
      .reduce(sum, 0);

    const expenses = transactionsOfDay
      .filter((t) => !t.income)
      .map((t) => t.amount)
      .reduce(sum, 0);

    return { income, expenses };
  };

  // Dynamische Daten basierend auf timeRange
  const chartData = Array.from({ length: timeRange }, (_, dayIdx) =>
    calculateIncomeExpenses(transactions?.transactions, dayIdx)
  );

  // Labels oluşturma fonksiyonu mit Format-Verbesserung
  const generateLabels = (days) => {
    if (days <= 7) {
      // Für 7 Tage: Mo, Di, Mi...
      return Array.from({ length: days }, (_, idx) =>
        new Date(Date.now() - hours24 * idx).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric' })
      ).reverse();
    } else if (days <= 31) {
      // Für Monat: DD.MM
      return Array.from({ length: days }, (_, idx) =>
        new Date(Date.now() - hours24 * idx).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
      ).reverse();
    } else {
      // Für längere Zeiträume: MMM YY
      return Array.from({ length: days }, (_, idx) =>
        new Date(Date.now() - hours24 * idx).toLocaleDateString('de-DE', { month: 'short', year: '2-digit' })
      ).reverse();
    }
  };

  const labels = generateLabels(timeRange);

  // Dataset oluşturma fonksiyonu
  const createDataset = (label, data, backgroundColor) => ({
    label,
    data,
    backgroundColor,
    borderRadius: 5,
    barThickness: timeRange > 30 ? 8 : timeRange > 7 ? 12 : 16,
  });

  // Chart için data nesnesini oluşturma
  const dataWeek = {
    labels,
    datasets: [
      createDataset(
        intl.formatMessage({ id: 'statistics.income' }),
        chartData.map((day) => day.income),
        "#00B495"
      ),
      createDataset(
        intl.formatMessage({ id: 'statistics.expenses' }),
        chartData.map((day) => day.expenses),
        "#E4797F"
      ),
      createDataset(
        intl.formatMessage({ id: 'statistics.total' }),
        chartData.map((day) => day.income - day.expenses),
        "#2B47FC"
      ),
    ],
    maintainAspectRatio: false,
  };


  // ________________________________________________________

  const [sortStatistic, setSortStatistic] = useState([]);
  const [toggleTrans, setToggleTrans] = useState(true);

  const navigate = useNavigate();
  const asIncome = (amount, income) => (income ? amount : -amount);

  // İlk olarak transactions state'ini sortStatistic'e ayarlayın (useEffect ile)
  useEffect(() => {
    if (transactions?.transactions) {
      setSortStatistic([...transactions.transactions]);
    }
  }, [transactions]);

  // Genel bir sort fonksiyonu oluşturun
  const sortBy = (key, ascending = true) => {
    const sortedData = [...sortStatistic].sort((a, b) => {
      if (key === "amount") {
        // Gelir ve gider durumunu hesaba kat
        return ascending
          ? asIncome(a.amount, a.income) - asIncome(b.amount, b.income)
          : asIncome(b.amount, b.income) - asIncome(a.amount, a.income);
      }
      if (key === "date") {
        return ascending
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (key === "name") {
        return ascending
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });

    setSortStatistic(sortedData);
  };

  // Gelir/Gider toggle işlemi
  const handleToggleAmount = () => {
    setToggleTrans(!toggleTrans);
    sortBy("amount", toggleTrans);
  };

  // Select değişikliklerini ele alma
  const handleSelect = (e) => {
    e.preventDefault();
    const value = e.target.value;

    if (value === "Name") {
      sortBy("name", true);
    } else if (value === "Date") {
      sortBy("date", false);
    } else if (value === "Amount") {
      sortBy("amount", true);
    }
  };


  return (
    transactions && (
      <>
        <div className="min-h-screen lg:flex lg:justify-center lg:items-start lg:pt-8 lg:pr-20">
          <div className="lg:max-w-4xl lg:w-full">
            {/* Header */}
            <div className="bg-gradient-blue rounded-b-[20px] py-4 lg:rounded-[30px] lg:py-6">
              <div className="flex items-center px-[5%] lg:px-8">
                <div className="w-8 lg:w-10">
                  <img onClick={() => navigate(-1)} src={left} alt="left" className="cursor-pointer hover:scale-110 transition-transform" />
                </div>
                <h4 className="text-white text-center flex-1 text-lg lg:text-2xl font-semibold"><FormattedMessage id="nav.statistics" /></h4>
                <div className="w-8 lg:w-10"></div>
              </div>
            </div>

            {isLoading ? (
              <>
                {/* Skeleton for Chart */}
                <div className="px-[5%] py-6 lg:px-8 lg:py-8">
                  <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 animate-pulse">
                    <div className="h-64 bg-gray-100 rounded-lg mb-4 lg:h-80"></div>
                  </div>
                </div>
                
                {/* Skeleton for Filters */}
                <div className="px-[5%] lg:px-8">
                  <div className="flex justify-between items-center mb-4 animate-pulse">
                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                    <div className="flex gap-2">
                      <div className="h-10 bg-gray-200 rounded w-32"></div>
                      <div className="h-10 bg-gray-200 rounded w-10"></div>
                    </div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-40 mb-4"></div>
                </div>
                
                {/* Skeleton for Transactions */}
                <SkeletonLoader type="transaction" count={6} />
              </>
            ) : (
              <>
                {/* Chart */}
                <div className="px-[5%] py-6 lg:px-8 lg:py-8">
                  {/* Time Range Selector */}
                  <div className="mb-4 flex gap-2 flex-wrap justify-center">
                    {[
                      { days: 7, label: intl.formatMessage({ id: 'statistics.7days' }) },
                      { days: 14, label: intl.formatMessage({ id: 'statistics.14days' }) },
                      { days: 30, label: intl.formatMessage({ id: 'statistics.30days' }) },
                      { days: 90, label: intl.formatMessage({ id: 'statistics.90days' }) },
                      { days: 180, label: intl.formatMessage({ id: 'statistics.180days' }) },
                      { days: 365, label: intl.formatMessage({ id: 'statistics.365days' }) },
                    ].map((range) => (
                      <button
                        key={range.days}
                        onClick={() => setTimeRange(range.days)}
                        className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all duration-200 lg:px-4 lg:py-2 lg:text-base ${
                          timeRange === range.days
                            ? 'bg-gradient-blue text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 lg:p-6" style={{ height: '320px' }}>
                    <BarChart chartData={dataWeek} />
                  </div>
                </div>

                {/* Transaction Header with Filters */}
                <div className="px-[5%] py-2 flex justify-between items-center lg:px-8">
                <h6 className="m-0 text-base lg:text-xl font-semibold"><FormattedMessage id="statistics.topSpending" /></h6>
                <div className="flex gap-2">
                  <form action="">
                    <select
                      onChange={handleSelect}
                      name=""
                      id=""
                      className="border border-gray-400 px-2 py-1 rounded-lg text-sm lg:px-3 lg:py-2 lg:text-base focus:outline-none focus:border-darkBlue"
                    >
                      <option value=""><FormattedMessage id="statistics.filterBy" /></option>
                      <option value="Amount"><FormattedMessage id="statistics.amount" /></option>
                      <option value="Name"><FormattedMessage id="statistics.name" /></option>
                      <option value="Date"><FormattedMessage id="statistics.date" /></option>
                    </select>
                  </form>
                  <img onClick={handleToggleAmount} src={Vector} alt={Vector} className="cursor-pointer hover:scale-110 transition-transform w-5 lg:w-6" />
                </div>
              </div>

              {/* Transactions List */}
              <div className="overflow-auto h-[40vh] lg:h-[35vh] px-[5%] mt-2 pb-24 lg:pb-8 lg:px-8 scrollbar-hide">
                <div>
                  {transactions?.transactions?.map((ele, index) => (
                    <Link key={index} to={`/transaction/detail/${ele._id}`} className="no-underline">
                      <motion.div
                        className="flex justify-between items-center my-4 lg:my-5 lg:p-3 lg:rounded-lg lg:hover:bg-gray-50 transition-colors"
                        initial={{ y: "100vh" }}
                        animate={{
                          opacity: [0, 0.5, 1],
                          y: [100, 0, 0],
                        }}
                        transition={{
                          type: "twin",
                          duration: 0.5,
                          delay: (parseInt(index) + 0.5) / 10,
                        }}
                      >
                        <div className="flex items-center">
                          <div className="p-3 lg:p-4 bg-[#dddddd]/80 rounded-[10px] mr-2 flex items-center justify-center">
                            <h3 className="m-0 text-gray-600 lg:text-xl">{ele.name && ele.name.charAt(0)}</h3>
                          </div>
                          <div>
                            <h5 className="m-0 text-left text-black font-medium lg:text-lg">{ele.name}</h5>
                            <p className="m-0 text-left text-gray-500 text-sm lg:text-base">
                              {new Date(ele.createdAt).toLocaleDateString("de-DE", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>

                        <p
                          className="text-lg lg:text-xl font-medium"
                          style={
                            ele.income ? { color: "#25A969" } : { color: "#F95B51" }
                          }
                        >
                          {ele.income && ele.income
                            ? `+ $${ele.amount.toFixed(2)}`
                            : `- $${ele.amount.toFixed(2)}`}
                        </p>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
              </>
            )}
          </div>
        </div>
        <Nav />
      </>
    )
  );
};

export default Statistic;
