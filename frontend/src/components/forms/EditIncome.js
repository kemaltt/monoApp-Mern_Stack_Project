import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import left from "../../assets/images/chevron-left.png";
import Delete from "../Icons/Delete";
import Nav from "../common/Nav";
import { BiImageAdd, BiXCircle } from "react-icons/bi";
import { motion } from "framer-motion";
import TopMobileBar from "../common/TopMobileBar";
import {
  useDeleteFromTransactionMutation,
  useDeleteImageMutation,
  useGetTransactionByIdMutation,
  useUpdateTransactionByIdMutation,
} from "../../redux/transaction/transaction-api";
import { apiBaseUrl } from "../../api/api";

const EditIncome = () => {
  const { id } = useParams();
  const [deleteFromTransaction] = useDeleteFromTransactionMutation();
  const [getTransactionById, { data }] = useGetTransactionByIdMutation();
  const [deleteImage] = useDeleteImageMutation();
  const [updateTransactionById, { isLoading }] = useUpdateTransactionByIdMutation();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [img, setReceipt] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const navigate = useNavigate();
  console.log(data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTransactionById(id).unwrap();
        if (response) {
          setName(response.name);
          setAmount(response.amount);
          setCreatedAt(new Date(response.createdAt).toISOString().substring(0, 16));
          if (response.img) {
            setPreviewImg(
              response.img.url.startsWith("http")
                ? response.img.url
                : `${apiBaseUrl}/${response.img.url}`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    fetchData();
  }, [id, getTransactionById]);

  const deleteTransaction = async () => {
    await deleteFromTransaction(id).unwrap();
    navigate("/home");
  };

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

  const removeImage = async () => {
    if (data?.img)
      await deleteImage(data?.img?.url).unwrap();
    setReceipt(null);
    setPreviewImg(null);
  };

  const editTransaction = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("amount", amount);
    formData.append("createdAt", createdAt);
    formData.set("income", true);
    if (img) {
      formData.append("img", img, img.name);
    }

    await updateTransactionById({ id, formData }).unwrap();
    navigate("/home");
  };

  return (
    <>
      <div className="min-h-screen lg:flex lg:justify-center lg:items-start lg:pt-8 lg:pr-20">
        <div className="lg:max-w-4xl lg:w-full">
          <div className="bg-bgGreen rounded-b-[20px] h-[25vh] lg:h-[30vh] lg:rounded-[30px]">
            <TopMobileBar />
            <div className="flex justify-between items-center px-[5%] pt-6 lg:px-8">
              <img onClick={() => navigate(-1)} src={left} alt="left" className="w-6 h-6 lg:w-8 lg:h-8 cursor-pointer hover:scale-110 transition-transform" />
              <div onClick={deleteTransaction} className="cursor-pointer hover:scale-110 transition-transform">
                <Delete />
              </div>
            </div>
            <h4 className="text-white text-center text-lg lg:text-2xl font-semibold mt-4">Edit Income</h4>
          </div>

          <motion.form
            action=""
            initial={{ y: "-10vh" }}
            animate={{ y: 10 }}
            transition={{
              delay: 0.4,
              type: "spring",
              stiffness: 200,
              ease: "easeInOut",
            }}
            whileHover={{ scale: 1.01 }}
            onSubmit={editTransaction}
            className="bg-white rounded-[20px] shadow-[5px_5px_5px_5px_rgba(0,0,0,0.1)] mx-[5%] -mt-6 lg:mx-8 lg:-mt-8"
          >
            <div className="px-[5%] py-8 lg:px-[8%] lg:py-10">
              <label htmlFor="amount" className="text-gray-500 font-medium text-xs block text-left pb-2 lg:text-sm">Name</label>
              <input
                type="text"
                name="amount"
                id="amount"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block text-left py-3 px-[4%] mb-4 w-full rounded-lg border border-[#dddddd] lg:py-4 lg:text-base focus:outline-none focus:border-darkBlue"
              />

              <label htmlFor="amount" className="text-gray-500 font-medium text-xs block text-left pb-2 lg:text-sm">AMOUNT</label>
              <input
                type="number"
                name="amount"
                id="amount"
                placeholder="Amount"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block text-left py-3 px-[4%] mb-4 w-full rounded-lg border border-[#dddddd] lg:py-4 lg:text-base focus:outline-none focus:border-darkBlue"
              />

              <label htmlFor="date" className="text-gray-500 font-medium text-xs block text-left pb-2 lg:text-sm">DATE</label>
              <input
                type="datetime-local"
                name="date"
                id="date"
                required
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
                className="block text-left py-3 px-[4%] mb-4 w-full rounded-lg border border-[#dddddd] lg:py-4 lg:text-base focus:outline-none focus:border-darkBlue"
              />

              <label htmlFor="receipt" className="text-gray-500 font-medium text-xs block text-left pb-2 lg:text-sm">RECEIPT</label>
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
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 border border-dashed border-gray-500 py-3 px-[4%] w-full rounded-lg mb-4 justify-center hover:border-darkBlue lg:text-base lg:py-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <BiImageAdd size={24} /> Add Receipt
                </label>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-bgGreen border-none py-4 rounded-[50px] mb-2 text-white text-lg font-semibold w-full lg:text-xl lg:py-5 hover:opacity-90 transition-all duration-300 disabled:opacity-50"
              >
                Save
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
      <Nav />
    </>
  );
};

export default EditIncome;
