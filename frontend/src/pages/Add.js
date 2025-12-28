import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import left from "../assets/images/chevron-left.png";
import dots from "../assets/images/threeDots.png";
import Nav from "../components/common/Nav";
// import { IoReceiptSharp } from "react-icons/io5";
import { BiImageAdd, BiXCircle } from "react-icons/bi";
import { motion } from "framer-motion";
import TopMobileBar from "../components/common/TopMobileBar";
import { useAddToTransactionMutation } from "../redux/transaction/transaction-api";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

const Add = () => {
  const intl = useIntl();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [addToTransaction, { isLoading }] = useAddToTransactionMutation();

  const [income, setIncome] = useState(true);
  const [img, setReceipt] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceipt(file);

      // Create an image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImg(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setReceipt(null);
    setPreviewImg(null);
  };

  async function handleTransaction(data) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("amount", data.amount);

    if (data.createdAt) {
      formData.append("createdAt", data.createdAt);
    } else {
      formData.append("createdAt", new Date());
    }

    if (img) {
      formData.append("img", img, img.name);
    }

    formData.append("income", income);

    await addToTransaction(formData).unwrap();
    navigate("/home");
  }

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900 lg:flex lg:justify-center lg:items-start lg:pt-8 lg:pr-20">
        <div className="lg:max-w-4xl lg:w-full">
          <div
            style={
              income
                ? { backgroundColor: "#00B495" }
                : { backgroundColor: "rgba(228, 121, 127, 1)" }
            }
            className="rounded-b-[20px] h-[25vh] lg:h-[30vh] lg:rounded-[30px]"
          >
            <TopMobileBar />
            <div className="flex justify-center gap-4 pt-12 lg:pt-16">
              <button 
                onClick={() => setIncome(true)}
                className={`px-6 py-2 lg:px-8 lg:py-3 rounded-full text-sm lg:text-base font-medium transition-all ${income ? 'bg-white text-bgGreen' : 'bg-white/20 text-white'}`}
              >
                <FormattedMessage id="add.addIncome" />
              </button>
              <button 
                onClick={() => setIncome(false)}
                className={`px-6 py-2 lg:px-8 lg:py-3 rounded-full text-sm lg:text-base font-medium transition-all ${!income ? 'bg-white text-bgRed' : 'bg-white/20 text-white'}`}
              >
                <FormattedMessage id="add.addExpense" />
              </button>
            </div>
          </div>

          <div>
            <div className={`flex justify-between items-center px-[5%] py-4 lg:px-8 lg:py-6 ${income ? 'text-bgGreen' : 'text-bgRed'}`}>
              <Link to="/home">
                <img src={left} alt="left" className="w-6 h-6 lg:w-8 lg:h-8" />
              </Link>

              <h4 className={`text-lg lg:text-2xl font-semibold m-0 ${income ? 'text-bgGreen' : 'text-bgRed'}`}>
                <FormattedMessage id={income ? "add.addIncome" : "add.addExpense"} />
              </h4>
              <img src={dots} alt="dots" className="w-6 h-6 lg:w-8 lg:h-8" />
            </div>

            <motion.form
              onSubmit={handleSubmit(handleTransaction)}
              className="bg-white dark:bg-gray-800 rounded-[20px] shadow-[5px_5px_5px_5px_rgba(0,0,0,0.1)] dark:shadow-gray-900/50 mx-[5%] lg:mx-8 mt-4"
            >
              <div className="px-[5%] py-8 lg:px-[8%] lg:py-10">
                <label className="text-gray-500 dark:text-gray-400 font-medium text-xs block text-left pb-2 lg:text-sm"><FormattedMessage id="add.name" /></label>
                <input
                  type="text"
                  placeholder={intl.formatMessage({ id: 'add.name' })}
                  {...register("name", { required: intl.formatMessage({ id: 'validation.nameRequired' }) })}
                  className="block text-left py-3 px-[4%] mb-2 w-full rounded-lg border border-[#dddddd] dark:border-gray-600 dark:bg-gray-700 dark:text-white lg:py-4 lg:text-base focus:outline-none focus:border-darkBlue dark:focus:border-blue-400"
                />
                {errors.name && <span className="text-red-500 text-xs lg:text-sm mb-2 block">{errors.name.message}</span>}

                <label htmlFor="amount" className="text-gray-500 dark:text-gray-400 font-medium text-xs block text-left pb-2 lg:text-sm"><FormattedMessage id="add.amount" /></label>
                <input
                  type="number"
                  placeholder={intl.formatMessage({ id: 'add.amount' })}
                  {...register("amount", { 
                    required: intl.formatMessage({ id: 'validation.amountRequired' }),
                    min: { value: 0.01, message: intl.formatMessage({ id: 'validation.amountMin' }) }
                  })}
                  className="block text-left py-3 px-[4%] mb-2 w-full rounded-lg border border-[#dddddd] dark:border-gray-600 dark:bg-gray-700 dark:text-white lg:py-4 lg:text-base focus:outline-none focus:border-darkBlue dark:focus:border-blue-400"
                />
                {errors.amount && <span className="text-red-500 text-xs lg:text-sm mb-2 block">{errors.amount.message}</span>}

                <label htmlFor="date" className="text-gray-500 dark:text-gray-400 font-medium text-xs block text-left pb-2 lg:text-sm"><FormattedMessage id="add.date" /></label>
                <input
                  type="datetime-local"
                  {...register("createdAt")}
                  className="block text-left py-3 px-[4%] mb-4 w-full rounded-lg border border-[#dddddd] dark:border-gray-600 dark:bg-gray-700 dark:text-white lg:py-4 lg:text-base focus:outline-none focus:border-darkBlue dark:focus:border-blue-400"
                />

                <label htmlFor="receipt" className="text-gray-500 dark:text-gray-400 font-medium text-xs block text-left pb-2 lg:text-sm"><FormattedMessage id="add.receipt" /></label>
                {previewImg ? (
                  <div className="relative w-full h-48 lg:h-64 my-2 text-center">
                    <img src={previewImg} alt="Uploaded receipt" className="w-full h-full object-contain rounded-lg border-2 border-[#ddd]" />
                    <BiXCircle 
                      className="absolute -top-2 -right-2 text-[#ff4d4d] bg-white rounded-full cursor-pointer hover:scale-125 transition-transform" 
                      size={24} 
                      onClick={removeImage} 
                    />
                  </div>
                ) : (
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-400 border border-dashed border-gray-500 dark:border-gray-600 py-3 px-[4%] w-full rounded-lg mb-4 justify-center hover:border-darkBlue dark:hover:border-blue-400 lg:text-base lg:py-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <BiImageAdd size={24} /> <FormattedMessage id="add.addReceipt" />
                  </label>
                )}

                <button
                  style={income ? {backgroundColor: "#00B495"} : {backgroundColor: "rgba(228, 121, 127, 1)"}}
                  className="border-none py-4 rounded-[50px] mb-2 text-white text-lg font-semibold w-full lg:text-xl lg:py-5 hover:opacity-90 transition-all duration-300"
                  type="submit"
                  disabled={isLoading}
                >
                  <FormattedMessage id="common.save" />
                  {isLoading && (
                    <span
                      className="spinner-border spinner-border-sm mx-1"
                      role="status"
                    ></span>
                  )}
                </button>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Add;
