import { Link, useNavigate } from "react-router-dom";
import Man from "../assets/images/man.png";
import { motion } from "framer-motion";
import { useLoginMutation } from "../redux/auth/auth-api";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { BiShow, BiHide } from "react-icons/bi";
import { getErrorMessage } from "../utils/errorHandler";
import { formAnimation } from "../utils/animationHelpers";
import { FormattedMessage, useIntl } from "react-intl";

const Login = ({ saveToken }) => {
  const intl = useIntl();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogIn = async (data) => {
    const response = await login(data);
    if (response.error) {
      setErrorMessage(getErrorMessage(response));
    } else {
      saveToken(response.data.accessToken);
      setTimeout(() => {
        navigate("/home");
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat bg-[position:0_-30vh] px-[8%] lg:flex lg:items-center lg:justify-center lg:px-4" 
         style={{ backgroundImage: "url('../assets/images/lightBlueBackground.png')" }}>
      <div className="lg:max-w-2xl lg:w-full">
        <h1 className="pt-8 pb-6 text-center lg:text-5xl"><FormattedMessage id="auth.login" /></h1>
        
        {/* Animated Man Image */}
        <img
          src={Man}
          alt="the määään"
          className="w-[40%] relative z-[999] mx-auto animate-[guy_3s_infinite_ease-in-out] lg:w-[30%]"
        />

        <motion.form
          onSubmit={handleSubmit(handleLogIn)}
          {...formAnimation}
          className="bg-white shadow-[5px_5px_5px_5px_rgba(0,0,0,0.1)] rounded-[20px] -mt-28 pt-16 pb-6 block lg:-mt-20 lg:pt-20 lg:pb-8"
        >
          <div className="px-[5%] pt-2 pb-14 lg:px-[8%] lg:pt-4">
            <label htmlFor="email" className="text-gray-500 font-medium text-xs block text-left pb-2 lg:text-sm">
              <FormattedMessage id="auth.email" />
            </label>
            <input
              type="email"
              id="email"
              placeholder={intl.formatMessage({ id: 'auth.email' })}
              {...register("email", {
                required: intl.formatMessage({ id: 'validation.emailRequired' }),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: intl.formatMessage({ id: 'validation.emailInvalid' }),
                },
              })}
              className="block text-left py-3 px-[4%] mb-2 w-full rounded-lg border border-[#dddddd] lg:py-4 lg:text-base focus:outline-none focus:border-darkBlue"
            />
            {errors.email && (
              <span className="text-red-500 text-xs lg:text-sm">{errors.email.message}</span>
            )}

            <label htmlFor="password" className="text-gray-500 font-medium text-xs block text-left pb-2 mt-4 lg:text-sm">
              <FormattedMessage id="auth.password" />
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder={intl.formatMessage({ id: 'auth.password' })}
                {...register("password", {
                  required: intl.formatMessage({ id: 'validation.passwordRequired' }),
                  minLength: {
                    value: 8,
                    message: intl.formatMessage({ id: 'validation.passwordMinLength' }),
                  },
                })}
                className="block text-left py-3 px-[4%] pr-12 mb-4 w-full rounded-lg border border-[#dddddd] lg:py-4 lg:text-base focus:outline-none focus:border-darkBlue"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-darkBlue"
              >
                {showPassword ? <BiHide size={24} /> : <BiShow size={24} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs lg:text-sm">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="bg-gradient-blue border-none py-4 rounded-[50px] text-white text-lg font-semibold w-[80%] mx-auto block lg:text-xl lg:py-5 hover:bg-gradient-blue-reverse transition-all duration-300"
          >
            <FormattedMessage id="auth.login" />
            {isLoading && (
              <span
                className="spinner-border spinner-border-sm mx-1"
                role="status"
              ></span>
            )}
          </button>

          {/* Error Message */}
          {errorMessage && (
            <div className="alert alert-danger text-center mt-3 mx-auto w-[80%]" role="alert">
              {errorMessage}
            </div>
          )}
        </motion.form>

        <p className="py-4 px-[2%] text-xs m-0 lg:text-sm lg:text-center">
          <FormattedMessage id="auth.noAccount" />{" "}
          <Link to="/signup" className="no-underline text-darkBlue hover:underline">
            <FormattedMessage id="auth.signup" />
          </Link>
        </p>
      </div>

      <style jsx>{`
        @keyframes guy {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
