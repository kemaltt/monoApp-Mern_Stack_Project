import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { useResetPassportMutation } from '../redux/auth/auth-api';
import { useForm } from 'react-hook-form';
import { BiShow, BiHide } from 'react-icons/bi';

const ResetPassport = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [resetPassport, { isLoading }] = useResetPassportMutation();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const key = searchParams.get('reset_passport_key');

  useEffect(() => {
    if (!key) {
      toast.error(intl.formatMessage({ id: 'auth.verificationTokenMissing' }));
      navigate('/login');
    }
  }, [key, intl, navigate]);

  const onSubmit = async (data) => {
    try {
      await resetPassport({ reset_passport_key: key, passport: data.passport }).unwrap();
      toast.success(intl.formatMessage({ id: 'auth.passportResetSuccess' }));
      navigate('/login');
    } catch (error) {
      const msg = (error?.data?.message || error?.message || intl.formatMessage({ id: 'auth.resendFailed' })).replace(/^Error:\s*/i, '');
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-gray-900">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white"><FormattedMessage id="auth.resetPassportTitle" /></h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4"><FormattedMessage id="auth.resetPassportDesc" /></p>
        <label className="block text-xs text-gray-500 mb-2"><FormattedMessage id="auth.passport" /></label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="block text-left py-3 px-[4%] pr-12 mb-2 w-full rounded-lg border border-[#dddddd] dark:border-gray-600 dark:bg-gray-700 dark:text-white lg:py-4 lg:text-base focus:outline-none focus:border-darkBlue dark:focus:border-blue-400"
            {...register('passport', { required: intl.formatMessage({ id: 'auth.passportRequired' }) })}
            aria-invalid={errors.passport ? 'true' : 'false'}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-darkBlue dark:hover:text-blue-400"
          >
            {showPassword ? <BiHide size={24} /> : <BiShow size={24} />}
          </button>
        </div>
        {errors.passport && <span className="text-red-500 text-xs mb-2 block">{errors.passport.message}</span>}

        <label className="block text-xs text-gray-500 mb-2"><FormattedMessage id="auth.confirmPassport" /></label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            className="block text-left py-3 px-[4%] pr-12 mb-2 w-full rounded-lg border border-[#dddddd] dark:border-gray-600 dark:bg-gray-700 dark:text-white lg:py-4 lg:text-base focus:outline-none focus:border-darkBlue dark:focus:border-blue-400"
            {...register('passportConfirm', {
              required: intl.formatMessage({ id: 'auth.passportRequired' }),
              validate: (value) => value === watch('passport') || intl.formatMessage({ id: 'auth.passportMismatch' }),
            })}
            aria-invalid={errors.passportConfirm ? 'true' : 'false'}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-darkBlue dark:hover:text-blue-400"
          >
            {showConfirm ? <BiHide size={24} /> : <BiShow size={24} />}
          </button>
        </div>
        {errors.passportConfirm && <span className="text-red-500 text-xs mb-2 block">{errors.passportConfirm.message}</span>}

        <button disabled={isLoading} className="w-full bg-gradient-blue text-white py-3 mt-2 rounded-[50px]">
          <FormattedMessage id="auth.resetPassportButton" />
        </button>
      </form>
    </div>
  );
};

export default ResetPassport;
