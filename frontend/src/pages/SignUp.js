import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiImageAdd, BiXCircle, BiShow, BiHide } from "react-icons/bi";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "../redux/auth/auth-api";
import { getErrorMessage } from "../utils/errorHandler";
import { formAnimation } from "../utils/animationHelpers";
import { FormattedMessage, useIntl } from "react-intl";

const SignUp = () => {
  const intl = useIntl();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [registerMutation, { isLoading }] = useRegisterMutation();
  const [previewImg, setPreviewImg] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("profile_image", file); // React Hook Form'un "setValue" fonksiyonu ile image state'i güncelleyebiliriz.

      // Create an image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImg(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setValue("profile_image", null);
    setPreviewImg(null);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.profile_image) {
      formData.append("profile_image", data.profile_image, data.profile_image.name);
    }

    const response = await registerMutation(formData);
    if (response.error) {
      setErrorMessage(getErrorMessage(response));
    } else {
      setErrorMessage(<p className="text-success"><FormattedMessage id="messages.accountCreated" /></p>);
      setTimeout(() => {
        navigate("/login");
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat bg-[position:0_-30vh] px-[8%] lg:flex lg:items-center lg:justify-center lg:px-4"
         style={{ backgroundImage: "url('../assets/images/lightBlueBackground.png')" }}>
      <div className="lg:max-w-2xl lg:w-full">
        <h1 className="pt-8 pb-16 text-center lg:text-5xl"><FormattedMessage id="auth.signup" /></h1>
        
        <motion.form
          {...formAnimation}
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-[5px_5px_5px_5px_rgba(0,0,0,0.1)] rounded-[20px] pt-8 block"
        >
          <div className="px-[5%] pb-4 lg:px-[8%]">
            <label htmlFor="name" className="text-gray-500 font-medium text-xs block text-left pb-2 lg:text-sm">
              <FormattedMessage id="auth.name" />
            </label>
            <input
              type="text"
              {...register("name", 
                { required: intl.formatMessage({ id: 'validation.nameRequired' }),
                  pattern: {
                    value: /^(?=)(?=).{2,15}$/,
                    message: intl.formatMessage({ id: 'validation.nameInvalid' }),
                  },
                })}
              placeholder={intl.formatMessage({ id: 'auth.fullName' })}
              className="block text-left py-3 px-[4%] mb-2 w-full rounded-lg border border-[#dddddd] lg:py-4 lg:text-base focus:outline-none focus:border-darkBlue"
            />
            {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}

            <label htmlFor="email" className="text-gray-500 font-medium text-xs block text-left pb-2 mt-2 lg:text-sm">
              <FormattedMessage id="auth.email" />
            </label>
            <input
              type="email"
              {...register("email", {
                required: intl.formatMessage({ id: 'validation.emailRequired' }),
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: intl.formatMessage({ id: 'validation.emailInvalid' }),
                },
              })}
              placeholder={intl.formatMessage({ id: 'auth.email' })}
              className="block text-left py-3 px-[4%] mb-2 w-full rounded-lg border border-[#dddddd] lg:py-4 lg:text-base focus:outline-none focus:border-darkBlue"
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}

            <label htmlFor="password" className="text-gray-500 font-medium text-xs block text-left pb-2 mt-2 lg:text-sm">
              <FormattedMessage id="auth.password" />
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: intl.formatMessage({ id: 'validation.passwordRequired' }),
                  minLength: {
                    value: 8,
                    message: intl.formatMessage({ id: 'validation.passwordMinLength' }),
                  },
                })}
                placeholder={intl.formatMessage({ id: 'auth.password' })}
                className="block text-left py-3 px-[4%] pr-12 mb-2 w-full rounded-lg border border-[#dddddd] lg:py-4 lg:text-base focus:outline-none focus:border-darkBlue"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-darkBlue"
              >
                {showPassword ? <BiHide size={24} /> : <BiShow size={24} />}
              </button>
            </div>
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}

            <label htmlFor="picture" className="text-gray-500 font-medium text-xs block text-left pb-2 mt-4 lg:text-sm">
              <FormattedMessage id="auth.profilePicture" />
            </label>
            {previewImg ? (
              <div className="relative w-[150px] h-[150px] my-2 mx-auto text-center">
                <img src={previewImg} alt="Preview" className="w-full h-full rounded-full object-cover border-2 border-[#ddd]" />
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
                <BiImageAdd size={24} /> <FormattedMessage id="auth.addProfilePhoto" />
              </label>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-blue border-none py-4 rounded-[50px] mb-4 text-white text-lg font-semibold w-full lg:text-xl lg:py-5 hover:bg-gradient-blue-reverse transition-all duration-300"
            >
              <FormattedMessage id="auth.register" />
              {isLoading && (
                <span className="spinner-border spinner-border-sm mx-1" role="status"></span>
              )}
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="alert alert-danger text-center mt-3 mx-[5%]" role="alert">
              {errorMessage}
            </div>
          )}
        </motion.form>
        
        <p className="py-4 px-[2%] text-xs m-0 lg:text-sm lg:text-center">
          <FormattedMessage id="auth.haveAccount" />{" "}
          <Link to="/login" className="no-underline text-darkBlue hover:underline">
            <FormattedMessage id="auth.login" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
