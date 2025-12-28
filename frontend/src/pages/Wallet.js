import React, { useEffect } from "react";
import Add from "../assets/images/Add.png";
import Pay from "../assets/images/Pay.png";
import Send from "../assets/images/Send.png";
import Nav from "../components/common/Nav";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useGetTransactionsMutation } from "../redux/transaction/transaction-api";
import SkeletonLoader from "../components/common/SkeletonLoader";
import { FormattedMessage } from "react-intl";
import EmptyState from "../components/common/EmptyState";

const Wallet = () => {

  const [getTransactions, { isLoading }] = useGetTransactionsMutation();
  const { transactions } = useSelector((state) => state.transactions);

  useEffect(() => {
    const getAllTransactions = async () => {
      await getTransactions();
    }
    getAllTransactions();
  }, [getTransactions]);

  const income =
    transactions && Array.isArray(transactions.transactions)
      ? transactions.transactions
        .filter((t) => t.income === true)
        .map((t) => t.amount)
        .reduce((sum, amount) => sum + amount, 0)
      : 0;

  // console.log(income);
  const expenses =
    transactions && Array.isArray(transactions.transactions)
      ? transactions.transactions
        .filter((f) => f.income === false)
        .map((f) => f.amount)
        .reduce((sum, amount) => sum + amount, 0)
      : 0;

  const totalBalance = (income - expenses).toFixed(2);
  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900 lg:flex lg:justify-center lg:items-start lg:pt-8 lg:pr-20">
        <div className="lg:max-w-4xl lg:w-full">
          {/* Header */}
          <div className="bg-gradient-blue rounded-b-[20px] h-[25vh] lg:h-[30vh] lg:rounded-[30px]">
            {/* <TopMobileBar /> */}
            <div className="text-center pt-10 pb-4 lg:pt-16 lg:pb-8">
              <h4 className="text-white font-semibold text-lg lg:text-2xl"><FormattedMessage id="nav.wallet" /></h4>
            </div>
          </div>

          {/* White Container */}
          <motion.div
            initial={{ y: "-8vh" }}
            animate={{ y: 10 }}
            transition={{
              delay: 0.5,
              duration: 0.3,
              stiffness: 200,
              ease: "easeInOut",
            }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-[30px] w-[90%] mx-auto lg:w-[95%]"
          >
            {/* Total Balance */}
            <section className="pt-6 lg:pt-10">
              <p className="py-6 m-0 text-gray-500 dark:text-gray-400 lg:text-lg"><FormattedMessage id="home.totalBalance" /></p>
              <h2 className="pb-4 text-black dark:text-white text-3xl lg:text-5xl font-bold">
                ${transactions && totalBalance}
              </h2>
            </section>

            {/* Add/Pay/Send Group */}
            <div className="flex justify-evenly mx-auto pb-4 text-sm lg:pb-8 lg:text-base">
              <div className="text-center">
                <Link to="/add" className="no-underline text-black dark:text-white hover:text-darkBlue dark:hover:text-blue-400">
                  <img src={Add} alt="add" className="mx-auto mb-2 w-12 lg:w-16" />
                  <figcaption><FormattedMessage id="wallet.add" /></figcaption>
                </Link>
              </div>
              <div className="text-center">
                <a
                  href="https://pay.google.com/intl/de_de/about/banks/"
                  target="_blank"
                  rel="noreferrer"
                  className="no-underline text-black dark:text-white hover:text-darkBlue dark:hover:text-blue-400"
                >
                  <img src={Pay} alt="pay" className="mx-auto mb-2 w-12 lg:w-16" />
                  <figcaption><FormattedMessage id="wallet.pay" /></figcaption>
                </a>
              </div>
              <div className="text-center">
                <a
                  href="https://www.paypal.com/de/home"
                  target="_blank"
                  rel="noreferrer"
                  className="no-underline text-black dark:text-white hover:text-darkBlue dark:hover:text-blue-400"
                >
                  <img src={Send} alt="send" className="mx-auto mb-2 w-12 lg:w-16" />
                  <figcaption><FormattedMessage id="wallet.send" /></figcaption>
                </a>
              </div>
            </div>

            {/* Transaction Header */}
            <div className="px-[5%] py-2 text-left lg:px-8">
              <h6 className="m-0 text-base lg:text-xl font-semibold text-gray-900 dark:text-white"><FormattedMessage id="home.transactionsHistory" /></h6>
            </div>

            {/* Transactions List */}
            {isLoading ? (
              <SkeletonLoader type="balance" count={6} />
            ) : transactions && Array.isArray(transactions.transactions) && transactions.transactions.length > 0 ? (
              <div className="overflow-auto h-[40vh] lg:h-[35vh] px-[3%] mt-2 bg-white dark:bg-gray-800 rounded-[30px] pb-4 lg:px-8 scrollbar-hide">
                <div>
                  {transactions.transactions.map((ele, index) => (
                      <Link
                        key={index}
                        to={`/transaction/detail/${ele._id}`}
                        className="no-underline"
                      >
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
                              <h3 className="m-0 text-gray-600 dark:text-gray-200 lg:text-xl">
                                {ele.name && ele.name.charAt(0)}
                              </h3>
                            </div>
                            <div>
                              <h5 className="m-0 text-left text-black dark:text-white font-medium lg:text-lg">
                                {ele.name}
                              </h5>
                              <p className="m-0 text-left text-gray-500 dark:text-gray-400 text-sm lg:text-base">
                                {new Date(ele.createdAt).toLocaleDateString(
                                  "de-DE",
                                  {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                          <p
                            className="text-lg lg:text-xl font-medium"
                            style={{
                              color: ele.income ? "#25A969" : "#F95B51",
                            }}
                          >
                            {ele.income ? `+ $${ele.amount}` : `- $${ele.amount}`}
                          </p>
                        </motion.div>
                      </Link>
                    ))}
                </div>
              </div>
            ) : (
              <EmptyState type="wallet" />
            )}
          </motion.div>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Wallet;
