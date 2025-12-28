import { useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { useForgotPassportMutation } from '../redux/auth/auth-api';
import { useForm } from 'react-hook-form';

const ForgotPassport = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [forgotPassport, { isLoading }] = useForgotPassportMutation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await forgotPassport({ email: data.email }).unwrap();
      toast.success(intl.formatMessage({ id: 'auth.verificationEmailResent' }));
      navigate('/login');
    } catch (error) {
      const msg = (error?.data?.message || error?.message || intl.formatMessage({ id: 'auth.resendFailed' })).replace(/^Error:\s*/i, '');
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-gray-900">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white"><FormattedMessage id="auth.forgotPassportTitle" /></h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4"><FormattedMessage id="auth.forgotPassportDesc" /></p>
            <label htmlFor="email" className="text-gray-500 dark:text-gray-400 font-medium text-xs block text-left pb-2 lg:text-sm">
              <FormattedMessage id="auth.email" />
            </label>
            <input
              type="email"
              id="email"
              placeholder={intl.formatMessage({ id: 'auth.email' })}
              {...register('email', {
                required: intl.formatMessage({ id: 'validation.emailRequired' }),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: intl.formatMessage({ id: 'validation.emailInvalid' }),
                },
              })}
              className="block text-left py-3 px-[4%] mb-2 w-full rounded-lg border border-[#dddddd] dark:border-gray-600 dark:bg-gray-700 dark:text-white lg:py-4 lg:text-base focus:outline-none focus:border-darkBlue dark:focus:border-blue-400"
            />
            {errors.email && <span className="text-red-500 text-xs mb-2 block">{errors.email.message}</span>}
        <button disabled={isLoading} className="w-full bg-gradient-blue text-white py-3 rounded-[50px]">
          <FormattedMessage id="auth.sendPassportResetEmail" />
        </button>
      </form>
    </div>
  );
};

export default ForgotPassport;
