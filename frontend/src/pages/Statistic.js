import BarChart from "../components/charts/BarChart";
import { useEffect, useState } from "react";
import Nav from "../components/common/Nav";
import left from "../assets/images/ArrowLeft.png";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGetTransactionsMutation } from "../redux/transaction/transaction-api";
import { useSelector } from "react-redux";
import SkeletonLoader from "../components/common/SkeletonLoader";
import { FormattedMessage, useIntl } from "react-intl";

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
  const [sortBy, setSortByOption] = useState('date'); // 'date', 'amount', 'name'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'

  const navigate = useNavigate();
  const asIncome = (amount, income) => (income ? amount : -amount);

  // Sort und Filter Logik
  useEffect(() => {
    if (transactions?.transactions) {
      let filtered = [...transactions.transactions];
      
      // Filter by type
      if (filterType === 'income') {
        filtered = filtered.filter(t => t.income);
      } else if (filterType === 'expense') {
        filtered = filtered.filter(t => !t.income);
      }
      
      // Sort data
      const sorted = filtered.sort((a, b) => {
        let comparison = 0;
        
        if (sortBy === 'amount') {
          comparison = asIncome(a.amount, a.income) - asIncome(b.amount, b.income);
        } else if (sortBy === 'date') {
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
        } else if (sortBy === 'name') {
          comparison = a.name.localeCompare(b.name);
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      });
      
      setSortStatistic(sorted);
    }
  }, [transactions, sortBy, sortOrder, filterType]);

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
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

                {/* Modern Filter Section */}
                <div className="px-[5%] py-4 lg:px-8 lg:py-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 lg:p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="text-base lg:text-xl font-semibold text-gray-800 dark:text-white">
                        <FormattedMessage id="statistics.transactions" />
                      </h6>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {sortStatistic.length} <FormattedMessage id="statistics.items" />
                      </div>
                    </div>

                    {/* Filter Type Chips */}
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { value: 'all', label: intl.formatMessage({ id: 'statistics.all' }), icon: '📊' },
                        { value: 'income', label: intl.formatMessage({ id: 'statistics.incomeOnly' }), icon: '💰' },
                        { value: 'expense', label: intl.formatMessage({ id: 'statistics.expenseOnly' }), icon: '💸' },
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setFilterType(type.value)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm lg:text-base ${
                            filterType === type.value
                              ? 'bg-gradient-blue text-white shadow-md scale-105'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        <FormattedMessage id="statistics.sortBy" />:
                      </span>
                      {[
                        { value: 'date', label: intl.formatMessage({ id: 'statistics.date' }), icon: '📅' },
                        { value: 'amount', label: intl.formatMessage({ id: 'statistics.amount' }), icon: '💵' },
                        { value: 'name', label: intl.formatMessage({ id: 'statistics.name' }), icon: '🏷️' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSortByOption(option.value)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                            sortBy === option.value
                              ? 'bg-blue-500 text-white shadow-sm'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <span className="text-xs">{option.icon}</span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                      
                      {/* Sort Order Toggle */}
                      <button
                        onClick={toggleSortOrder}
                        className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                        title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                      >
                        <motion.span
                          animate={{ rotate: sortOrder === 'asc' ? 0 : 180 }}
                          transition={{ duration: 0.3 }}
                          className="text-lg"
                        >
                          ↑
                        </motion.span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {sortOrder === 'asc' ? 
                            <FormattedMessage id="statistics.ascending" /> : 
                            <FormattedMessage id="statistics.descending" />
                          }
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

              {/* Transactions List */}
              <div className="overflow-auto h-[40vh] lg:h-[35vh] px-[5%] pb-24 lg:pb-8 lg:px-8 scrollbar-hide">
                {sortStatistic.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                    <span className="text-4xl mb-3">🔍</span>
                    <p className="text-lg"><FormattedMessage id="statistics.noResults" /></p>
                  </div>
                ) : (
                  <div>
                    {sortStatistic.map((ele, index) => (
                      <Link key={index} to={`/transaction/detail/${ele._id}`} className="no-underline">
                        <motion.div
                          className="flex justify-between items-center my-4 lg:my-5 lg:p-3 lg:rounded-lg lg:hover:bg-gray-50 dark:lg:hover:bg-gray-700 transition-colors"
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
                            <div className="p-3 lg:p-4 bg-[#dddddd]/80 dark:bg-gray-600 rounded-[10px] mr-2 flex items-center justify-center">
                              <h3 className="m-0 text-gray-600 dark:text-gray-200 lg:text-xl">{ele.name && ele.name.charAt(0)}</h3>
                            </div>
                            <div>
                              <h5 className="m-0 text-left text-black dark:text-white font-medium lg:text-lg">{ele.name}</h5>
                              <p className="m-0 text-left text-gray-500 dark:text-gray-400 text-sm lg:text-base">
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
                            {ele.income
                              ? `+ $${ele.amount.toFixed(2)}`
                              : `- $${ele.amount.toFixed(2)}`}
                          </p>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                )}
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
