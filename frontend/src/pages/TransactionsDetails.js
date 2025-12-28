import { useParams } from "react-router-dom";
import left from "../assets/images/chevron-left.png";
import dots from "../assets/images/threeDots.png";
import up from "../assets/images/chevron-up.png";
import Nav from "../components/common/Nav";
import Loading from "../components/common/Loading";
import { apiBaseUrl } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import TopMobileBar from "../components/common/TopMobileBar";
import { useGetTransactionByIdMutation } from "../redux/transaction/transaction-api";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";

const TransactionsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [getTransactionById, { data: detailTransaction, isLoading }] = useGetTransactionByIdMutation()

  useEffect(() => {
    getTransactionById(id)
  }, [getTransactionById, id]);

  return (
    detailTransaction && (
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <div className="min-h-screen lg:flex lg:justify-center lg:items-start lg:pt-8 lg:pr-20">
          <div className="lg:max-w-4xl lg:w-full">
            <div className="bg-gradient-blue rounded-b-[20px] py-4 lg:rounded-[30px] lg:py-6">
              <TopMobileBar />
              <div className="flex justify-between items-center px-[5%] pt-6 lg:px-8">
                <img onClick={() => navigate(-1)} src={left} alt="left" className="w-6 h-6 lg:w-8 lg:h-8 cursor-pointer hover:scale-110 transition-transform" />
                <h4 className="text-white text-lg lg:text-2xl font-semibold m-0"><FormattedMessage id="transaction.details" /></h4>
                <img src={dots} alt="threeDots" className="w-6 h-6 lg:w-8 lg:h-8" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-[30px] w-[90%] mx-auto -mt-6 shadow-[5px_5px_5px_5px_rgba(0,0,0,0.1)] dark:shadow-gray-900/50 lg:w-[95%] lg:-mt-8">
              {isLoading
                ? <Loading />
                : <>
                  <div className="pt-8 pb-4 text-center lg:pt-12 lg:pb-6">
                    <div className="w-20 h-20 lg:w-28 lg:h-28 bg-[#dddddd]/80 dark:bg-gray-600 rounded-full mx-auto flex items-center justify-center mb-4">
                      <h3 className="text-gray-600 dark:text-gray-200 text-2xl lg:text-4xl m-0">{detailTransaction?.name?.charAt(0)}</h3>
                    </div>
                    <p
                      style={
                        detailTransaction.income
                          ? { color: "#25A969" }
                          : { color: "#F95B51" }
                      }
                      className="text-sm lg:text-base font-medium mb-2"
                    >
                      <FormattedMessage id={detailTransaction.income ? "home.income" : "home.expenses"} />
                    </p>
                    <h2 className="text-black dark:text-white text-3xl lg:text-5xl font-bold">${detailTransaction?.amount?.toFixed(2)} </h2>
                  </div>
                  
                  <div className="px-[5%] lg:px-8">
                    <div className="flex justify-between items-center py-4 border-t border-gray-200 dark:border-gray-700">
                      <h5 className="text-base lg:text-lg font-semibold m-0 text-gray-900 dark:text-white"><FormattedMessage id="transaction.details" /></h5>
                      <img src={up} alt="up" className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                    
                    <div className="pb-6">
                      <div className="space-y-3">
                        <p className="flex justify-between text-sm lg:text-base">
                          <span className="text-gray-500 dark:text-gray-400"><FormattedMessage id="transaction.status" /></span>
                          <span
                            style={
                              detailTransaction.income
                                ? { color: "#25A969" }
                                : { color: "#F95B51" }
                            }
                            className="font-medium"
                          >
                            <FormattedMessage id={detailTransaction.income ? "home.income" : "home.expenses"} />
                          </span>
                        </p>
                        <p className="flex justify-between text-sm lg:text-base">
                          <span className="text-gray-500 dark:text-gray-400"><FormattedMessage id="transaction.from" /></span>
                          <span className="font-medium">{detailTransaction.name}</span>
                        </p>
                        <p className="flex justify-between text-sm lg:text-base">
                          <span className="text-gray-500"><FormattedMessage id="transaction.time" /></span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {new Date(detailTransaction.createdAt).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                        </p>
                        <p className="flex justify-between text-sm lg:text-base">
                          <span className="text-gray-500 dark:text-gray-400"><FormattedMessage id="transaction.date" /></span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {new Date(detailTransaction.createdAt)
                              .toUTCString()
                              .slice(0, 17)}
                          </span>
                        </p>
                      </div>
                      
                      <p className="flex justify-between py-3 mt-4 border-t border-gray-200 dark:border-gray-700 text-sm lg:text-base">
                        <span className="text-gray-500 dark:text-gray-400"><FormattedMessage id={detailTransaction.income ? "transaction.earnings" : "transaction.spending"} /></span>
                        <span className="font-semibold text-gray-900 dark:text-white">$ {detailTransaction?.amount?.toFixed(2)}</span>
                      </p>
                      <p className="flex justify-between py-3 border-t border-gray-200 dark:border-gray-700 text-base lg:text-lg">
                        <span className="font-semibold text-gray-900 dark:text-white"><FormattedMessage id="transaction.total" /></span>
                        <span className="font-bold text-gray-900 dark:text-white">$ {detailTransaction?.amount?.toFixed(2)}</span>
                      </p>

                      <div className="mt-6">
                        <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base mb-3"><FormattedMessage id="transaction.receipt" /></p>
                        {detailTransaction.img ? (
                          <img
                            src={
                              detailTransaction.img?.url.startsWith("http")
                                ? detailTransaction.img.url
                                : `${apiBaseUrl}/${detailTransaction.img.url}`
                            }
                            alt="upload receipt"
                            className="w-full h-auto rounded-lg border-2 border-gray-200 dark:border-gray-600"
                          />
                        ) : null}
                      </div>
                      
                      <div className="mt-6 pb-6">
                        <Link
                          to={
                            detailTransaction.income
                              ? `/editIncome/${detailTransaction._id}`
                              : `/editExpense/${detailTransaction._id}`
                          }
                          className="block text-center bg-darkBlue text-white py-3 rounded-full font-semibold text-base lg:text-lg lg:py-4 hover:bg-opacity-90 transition-all no-underline"
                        >
                          <FormattedMessage id="common.edit" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              }
            </div>
          </div>
        </div>
        <div>
          <Nav />
        </div>
      </div>
    )
  );
};

export default TransactionsDetails;
