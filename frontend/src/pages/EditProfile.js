import React, { useEffect, useState, useRef } from "react";
import { MdDelete } from "react-icons/md";
import Nav from "../components/common/Nav";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useGetTransactionsMutation } from "../redux/transaction/transaction-api";
import Loading from "../components/common/Loading";
import { apiBaseUrl } from "../api/api";
import { useUpdateUserMutation } from "../redux/auth/auth-api";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";



const EditProfile = () => {
  const [getTransactions, { isLoading: loadingTransactions }] = useGetTransactionsMutation();
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();
  const { transactions } = useSelector((state) => state.transactions);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profile_image, setprofile_image] = useState("");
  const [editMode, setEditMode] = useState({ name: false, email: false })
  const [showEditIcons, setShowEditIcons] = useState({ name: false, email: false });
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllTransactions = async () => {
      await getTransactions();
    };
    getAllTransactions();
  }, [getTransactions]);

  useEffect(() => {
    if (transactions) {
      setName(transactions.name);
      setEmail(transactions.email);
      setprofile_image(transactions.profile_image);
    }
  }, [transactions]);


  const handleImageChange = (e) => {
    setprofile_image(e.target.files[0]);
  };

  const handleRemoveImage = () => {
    setprofile_image(null);
  };
  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (profile_image) {
      if (typeof profile_image === 'string') {
        // Eski resim URL'ini gönderme
        formData.append('profile_image', profile_image);

      } else {
        formData.append('profile_image', profile_image);
      }
    }
    
    try {
      await updateUser(formData).unwrap();
      navigate("/profile");
    } catch (error) {
      console.error("Error update user", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <div className="min-h-screen lg:flex lg:justify-center lg:items-start lg:pt-8 lg:pr-20">
        <div className="lg:max-w-4xl lg:w-full">
          <div className="bg-gradient-blue rounded-b-[20px] h-[25vh] lg:h-[30vh] lg:rounded-[30px]">
            {/* <TopMobileBar /> */}
            <h4 className="text-white text-center pt-12 lg:pt-16 lg:text-2xl font-semibold"><FormattedMessage id="profile.editProfile" /></h4>
          </div>
          
          <motion.div
            initial={{ y: "-8vh" }}
            animate={{ y: 10 }}
            transition={{
              delay: 0.5,
              duration: 0.3,
              stiffness: 200,
              ease: "easeInOut",
            }}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-[30px] w-[90%] mx-auto -mt-6 shadow-[5px_5px_5px_5px_rgba(0,0,0,0.1)] lg:w-[95%] lg:-mt-8"
          >
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
              className="pt-8 lg:pt-12"
            >
              <div className="relative w-32 h-32 lg:w-40 lg:h-40 mx-auto">
                <img
                  src={
                    profile_image && typeof profile_image !== 'string' ? URL.createObjectURL(profile_image) :
                      profile_image?.startsWith("http")
                        ? profile_image
                        : profile_image ? `${apiBaseUrl}/${profile_image}` : null
                  }
                  alt={profile_image ? name : null}
                  className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover"
                />
                <MdOutlineEdit
                  className="absolute bottom-0 right-0 bg-darkBlue text-white p-2 rounded-full cursor-pointer hover:scale-110 transition-transform text-3xl lg:text-4xl"
                  onClick={openFileInput}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                {profile_image && (
                  <MdDelete
                    className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full cursor-pointer hover:scale-110 transition-transform text-3xl lg:text-4xl"
                    onClick={handleRemoveImage}
                  />
                )}
              </div>
            </motion.div>

            {(loadingTransactions || loadingUpdate) ? <Loading />
              : <div className="px-[5%] py-6 lg:px-8 lg:py-8">
                <motion.div
                  className="bg-white rounded-lg shadow-sm p-4 mb-4 lg:p-5"
                  initial={{ y: "100vh" }}
                  animate={{
                    opacity: [0, 0.5, 1],
                    y: [100, 0, 0],
                  }}
                  transition={{
                    type: "twin",
                    duration: 0.5,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <FaRegUser className="text-darkBlue text-xl lg:text-2xl" />
                    {!editMode.name ? (
                      <h5 
                        className="flex-1 text-base lg:text-lg m-0 cursor-pointer hover:bg-gray-50 p-2 rounded flex justify-between items-center"
                        onMouseEnter={() => setShowEditIcons({ ...showEditIcons, name: true })} 
                        onMouseLeave={() => setShowEditIcons({ ...showEditIcons, name: false })}
                      >
                        <span>{name}</span>
                        <MdOutlineEdit 
                          className="text-gray-400 hover:text-darkBlue transition-colors" 
                          onClick={() => setEditMode({ ...editMode, name: true })} 
                        />
                      </h5>
                    ) : (
                      <input
                        type="text"
                        value={name}
                        onBlur={() => setEditMode({ ...editMode, name: false })}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                        className="flex-1 border-b-2 border-darkBlue py-2 px-2 text-base lg:text-lg focus:outline-none"
                      />
                    )}
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white rounded-lg shadow-sm p-4 mb-6 lg:p-5"
                  initial={{ y: "100vh" }}
                  animate={{
                    opacity: [0, 0.5, 1],
                    y: [100, 0, 0],
                  }}
                  transition={{
                    type: "twin",
                    duration: 0.5,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <MdOutlineAlternateEmail className="text-darkBlue text-xl lg:text-2xl" />
                    {!editMode.email ? (
                      <h5 
                        className="flex-1 text-base lg:text-lg m-0 cursor-pointer hover:bg-gray-50 p-2 rounded flex justify-between items-center"
                        onMouseEnter={() => setShowEditIcons({ ...showEditIcons, email: true })} 
                        onMouseLeave={() => setShowEditIcons({ ...showEditIcons, email: false })}
                      >
                        <span>{email}</span>
                        <MdOutlineEdit 
                          className="text-gray-400 hover:text-darkBlue transition-colors" 
                          onClick={() => setEditMode({ ...editMode, email: true })} 
                        />
                      </h5>
                    ) : (
                      <input
                        type="email"
                        value={email}
                        onBlur={() => setEditMode({ ...editMode, email: false })}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                        className="flex-1 border-b-2 border-darkBlue py-2 px-2 text-base lg:text-lg focus:outline-none"
                      />
                    )}
                  </div>
                </motion.div>
              </div>
            }
            
            <div className="px-[5%] pb-6 lg:px-8 lg:pb-8">
              <button 
                onClick={handleSaveProfile} 
                disabled={isLoading}
                className="bg-darkBlue border-none py-4 rounded-[50px] text-white text-lg font-semibold w-full lg:text-xl lg:py-5 hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                <FormattedMessage id="profile.saveProfile" />
                {isLoading && (
                  <span className="spinner-border spinner-border-sm mx-1" role="status"></span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default EditProfile;