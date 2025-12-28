import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import arrowUp from "../assets/images/ArrowUp.png";
import threeDots from "../assets/images/threeDots.png";
import ArrowUpIcon from "../components/Icons/ArrowUpIcon";
import ArrowDownIcon from "../components/Icons/ArrowDownIcon";
import Nav from "../components/common/Nav";
import { motion } from "framer-motion";
import { useGetTransactionsMutation } from "../redux/transaction/transaction-api";
import { useSelector } from "react-redux";
import SkeletonLoader from "../components/common/SkeletonLoader";
import { cardAnimation, listItemAnimation } from "../utils/animationHelpers";
import { FormattedMessage } from "react-intl";
import EmptyState from "../components/common/EmptyState";

const Home = () => {

  const [getTransactions, { isLoading }] = useGetTransactionsMutation();
  const { transactions } = useSelector((state) => state.transactions);

  useEffect(() => {
    const getAllTransactions = async () => {

      await getTransactions();
    }
    getAllTransactions();
  }, [getTransactions]);

  const income =
    transactions?.transactions && Array.isArray(transactions?.transactions)
      ? transactions?.transactions
        .filter((t) => t.income === true)
        .map((t) => t.amount)
        .reduce((sum, amount) => sum + amount, 0)
      : 0;

  const expenses =
    transactions?.transactions && Array.isArray(transactions?.transactions)
      ? transactions?.transactions
        .filter((f) => f.income === false)
        .map((f) => f.amount)
        .reduce((sum, amount) => sum + amount, 0)
      : 0;

  const totalBalance = income - expenses;

  return (

    <>
      <div className="min-h-screen bg-white lg:flex lg:justify-center lg:items-start lg:pt-8 lg:pr-20">
        <div className="lg:max-w-4xl lg:w-full">
          {/* Header with Gradient */}
          <div className="bg-gradient-blue rounded-b-[20px] h-[25vh] lg:h-[30vh] lg:rounded-[30px]">
            <h4 className="text-white text-center pt-16 lg:pt-20 lg:text-2xl font-semibold">
              <FormattedMessage id="nav.home" />
            </h4>

            {/* Blue Container Card */}
            <motion.section
              {...cardAnimation}
              className="bg-darkBlue shadow-[0_0_40px_rgba(0,0,0,0.245)] rounded-[20px] text-left p-[5%] w-[90%] mx-auto transition-all duration-500 lg:p-8 lg:w-[95%]"
            >
              {/* Headline */}
              <div className="flex items-center pb-2 lg:pb-4">
                <h4 className="font-semibold text-base lg:text-xl mr-2">
                  <FormattedMessage id="home.totalBalance" />
                </h4>
                <img src={arrowUp} alt="arrow up" className="h-auto lg:w-5" />
                <img
                  src={threeDots}
                  alt="three dots"
                  className="ml-auto h-auto lg:w-5"
                />
              </div>

              <div className="text-white">
                {/* Amount */}
                <h2 className="text-white font-bold text-3xl lg:text-5xl pb-6 lg:pb-8">
                  $ {totalBalance?.toFixed(2)}
                </h2>

                {/* Income & Expenses */}
                <div className="flex justify-between items-center text-center gap-4 lg:gap-8">
                  <div className="flex-1">
                    <h4 className="mb-2 lg:mb-3 lg:text-lg">
                      <span className="inline-block fill-white mr-1 rounded-[50px] p-1.5 bg-white/15 lg:p-2">
                        <ArrowUpIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                      </span>
                      <FormattedMessage id="home.income" />
                    </h4>
                    <p className="m-0 text-white lg:text-xl">
                      $ {income?.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex-1">
                    <h4 className="mb-2 lg:mb-3 lg:text-lg">
                      <span className="inline-block fill-white mr-1 rounded-[50px] p-1.5 bg-white/15 lg:p-2">
                        <ArrowDownIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                      </span>
                      <FormattedMessage id="home.expenses" />
                    </h4>
                    <p className="m-0 text-white lg:text-xl">
                      $ {expenses?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>

          {isLoading ? (
            <>
              <SkeletonLoader type="card" />
              <div className="px-[5%] mt-16 lg:mt-20 lg:px-8">
                <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
              </div>
              <SkeletonLoader type="transaction" count={6} />
            </>
          ) : transactions && Array.isArray(transactions.transactions) && transactions.transactions.length > 0 ? (
            <>
              {/* Transaction Header */}
              <div className="px-[5%] mt-16 lg:mt-20 flex justify-between items-center lg:px-8">
                <h6 className="text-left text-base lg:text-xl font-semibold">
                  <FormattedMessage id="home.transactionsHistory" />
                </h6>
                <Link
                  to="/wallet"
                  className="no-underline text-sm lg:text-base text-gray-500 hover:text-darkBlue"
                >
                  <FormattedMessage id="common.seeAll" />
                </Link>
              </div>

              {/* Transactions List */}
              <div className="overflow-auto h-[50vh] lg:h-[45vh] px-[5%] pb-24 lg:pb-8 lg:px-8 bg-white scrollbar-hide">
                <div>
                  {transactions.transactions?.map((ele, index) => (
                    <Link
                      key={index}
                      to={`/transaction/detail/${ele._id}`}
                      className="no-underline"
                    >
                      <motion.div
                        className="flex justify-between items-center my-4 lg:my-5 lg:p-3 lg:rounded-lg lg:hover:bg-gray-50 transition-colors"
                        {...listItemAnimation(index)}
                      >
                        <div className="flex items-center">
                          <div
                            style={{
                              backgroundColor: ele.income
                                ? "#25A969"
                                : "#F95B51",
                            }}
                            className="w-[45px] h-[45px] lg:w-[55px] lg:h-[55px] rounded-[10px] mr-3 flex items-center justify-center"
                          >
                            <h3 className="text-white m-0 lg:text-xl">
                              {ele.name && ele.name.charAt(0)}
                            </h3>
                          </div>
                          <div>
                            <h5 className="mb-0.5 text-left text-black lg:text-lg font-medium">
                              {ele.name}
                            </h5>
                            <p className="m-0 text-left text-gray-500 text-sm lg:text-base">
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
                          {ele.income && ele.income
                            ? `+ $${ele.amount?.toFixed(2)}`
                            : `- $${ele.amount?.toFixed(2)}`}
                        </p>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="mt-16 lg:mt-20">
              <EmptyState type="transactions" />
            </div>
          )}
        </div>
      </div>
      <Nav />
    </>

  );
};

export default Home;
