import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FormattedMessage, useIntl } from "react-intl";
import { useVerifyAccountMutation, useResendVerificationMutation } from "../redux/auth/auth-api";
import { formAnimation } from "../utils/animationHelpers";
import { BiCheckCircle, BiXCircle, BiLoader } from "react-icons/bi";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifyAccount] = useVerifyAccountMutation();
  const [resendVerification] = useResendVerificationMutation();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [isExpired, setIsExpired] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setErrorMessage(intl.formatMessage({ id: 'auth.verificationTokenMissing' }));
      return;
    }

    // Extract email from token for resend functionality
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      setUserEmail(tokenPayload.email);
    } catch (e) {
      console.log("Could not decode token");
    }

    // Verify email
    verifyAccount(token)
      .unwrap()
      .then(() => {
        setStatus("success");
      })
      .catch((error) => {
        setStatus("error");
        let errorMsg = error?.data?.message || error?.message || intl.formatMessage({ id: 'auth.verificationFailed' });

        // Handle specific error messages
        if (errorMsg.includes("expired")) {
          errorMsg = intl.formatMessage({ id: 'auth.verificationTokenExpired' });
          setIsExpired(true);
        } else if (errorMsg.includes("already verified")) {
          errorMsg = intl.formatMessage({ id: 'auth.emailAlreadyVerified' });
        } else if (errorMsg.includes("Invalid")) {
          errorMsg = intl.formatMessage({ id: 'auth.verificationTokenInvalid' });
        }

        setErrorMessage(errorMsg);
      });
  }, [searchParams, verifyAccount, intl]);

  const handleResendVerification = async () => {
    if (!userEmail) return;
    
    setIsResending(true);
    try {
      await resendVerification({ email: userEmail }).unwrap();
      toast.success(intl.formatMessage({ id: 'auth.verificationEmailResent' }));
    } catch (error) {
      const errorMessage = (error?.data?.message || error?.message || intl.formatMessage({ id: 'auth.resendFailed' })).replace(/^Error:\s*/i, '');
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  // Countdown and redirect on success
  useEffect(() => {
    if (status === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, navigate]);

  return (
    <div className="min-h-screen bg-cover bg-no-repeat bg-[position:0_-30vh] dark:bg-gray-900 px-[8%] flex items-center justify-center"
      style={{ backgroundImage: "url('../assets/images/lightBlueBackground.png')" }}>
      <div className="lg:max-w-2xl lg:w-full">
        <motion.div
          {...formAnimation}
          className="bg-white dark:bg-gray-800 shadow-[5px_5px_5px_5px_rgba(0,0,0,0.1)] dark:shadow-gray-900/50 rounded-[20px] p-8 text-center"
        >
          {status === "verifying" && (
            <>
              <BiLoader className="mx-auto text-6xl text-darkBlue dark:text-blue-400 animate-spin mb-4" />
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                <FormattedMessage id="auth.verifyingEmail" />
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                <FormattedMessage id="auth.pleaseWait" />
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <BiCheckCircle className="mx-auto text-6xl text-green-500 mb-4" />
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                <FormattedMessage id="auth.emailVerifiedSuccess" />
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                <FormattedMessage id="auth.emailVerifiedMessage" />
              </p>
              <p className="text-darkBlue dark:text-blue-400 font-semibold">
                <FormattedMessage
                  id="auth.redirectingToLogin"
                  values={{ seconds: countdown }}
                />
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <BiXCircle className="mx-auto text-6xl text-red-500 mb-4" />
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                <FormattedMessage id="auth.verificationFailed" />
              </h1>
              <p className="text-red-600 dark:text-red-400 mb-6">
                {errorMessage}
              </p>
              {isExpired ? (
                <div className="space-y-3">
                  <button
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="bg-gradient-blue border-none py-3 px-8 rounded-[50px] text-white font-semibold hover:bg-gradient-blue-reverse transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResending ? (
                      <FormattedMessage id="auth.sending" />
                    ) : (
                      <FormattedMessage id="auth.resendVerificationLink" />
                    )}
                  </button>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <FormattedMessage id="auth.orGoBackTo" />{" "}
                    <button onClick={() => navigate("/login")} className="text-darkBlue dark:text-blue-400 underline">
                      <FormattedMessage id="auth.login" />
                    </button>
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-gradient-blue border-none py-3 px-8 rounded-[50px] text-white font-semibold hover:bg-gradient-blue-reverse transition-all duration-300"
                >
                  <FormattedMessage id="auth.goToLogin" />
                </button>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;
