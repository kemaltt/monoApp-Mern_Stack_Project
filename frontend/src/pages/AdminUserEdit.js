import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../redux/admin/admin-api';
import Loading from '../components/common/Loading';
import { format } from 'date-fns';

const AdminUserEdit = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, error } = useGetUserByIdQuery(id);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const user = data?.data;

  useEffect(() => {
    if (user) {
      reset({
        status: user.status,
        license_type: user.license_type,
        role: user.role,
      });
    }
  }, [user, reset]);

  const onSubmit = async (formData) => {
    try {
      await updateUser({ id, ...formData }).unwrap();
      toast.success(intl.formatMessage({ id: 'admin.updateSuccess' }));
      navigate('/admin');
    } catch (error) {
      const msg = (error?.data?.message || error?.message || 'Update failed').replace(/^Error:\s*/i, '');
      toast.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>

          <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6"></div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i}>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-4">
              <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-[50px] animate-pulse"></div>
              <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-[50px] animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-red-500 dark:text-red-400">
            {error?.data?.message || 'User not found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
          >
            ← <FormattedMessage id="common.back" />
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          <FormattedMessage id="admin.editUser" />
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            <FormattedMessage id="admin.userInfo" />
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400"><FormattedMessage id="admin.userName" />:</span>
              <span className="text-gray-900 dark:text-white font-medium">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400"><FormattedMessage id="admin.email" />:</span>
              <span className="text-gray-900 dark:text-white font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400"><FormattedMessage id="admin.registeredAt" />:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {user.createdAt ? format(new Date(user.createdAt), 'dd.MM.yyyy HH:mm') : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400"><FormattedMessage id="admin.lastLogin" />:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {user.lastLogin ? format(new Date(user.lastLogin), 'dd.MM.yyyy HH:mm') : '-'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            <FormattedMessage id="admin.editSettings" />
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FormattedMessage id="admin.status" />
              </label>
              <select
                {...register('status', { required: true })}
                className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="active">{intl.formatMessage({ id: 'admin.statusActive' })}</option>
                <option value="passive">{intl.formatMessage({ id: 'admin.statusPassive' })}</option>
                <option value="cancelled">{intl.formatMessage({ id: 'admin.statusCancelled' })}</option>
                <option value="deleted">{intl.formatMessage({ id: 'admin.statusDeleted' })}</option>
              </select>
              {errors.status && <span className="text-red-500 text-xs">Required</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FormattedMessage id="admin.licenseType" />
              </label>
              <select
                {...register('license_type', { required: true })}
                className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="trial">{intl.formatMessage({ id: 'admin.licenseTrial' })}</option>
                <option value="test_user">{intl.formatMessage({ id: 'admin.licenseTest' })}</option>
                <option value="premium">{intl.formatMessage({ id: 'admin.licensePremium' })}</option>
              </select>
              {errors.license_type && <span className="text-red-500 text-xs">Required</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FormattedMessage id="admin.role" />
              </label>
              <select
                {...register('role', { required: true })}
                className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="user">{intl.formatMessage({ id: 'admin.roleUser' })}</option>
                <option value="admin">{intl.formatMessage({ id: 'admin.roleAdmin' })}</option>
              </select>
              {errors.role && <span className="text-red-500 text-xs">Required</span>}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 bg-gradient-blue text-white py-3 rounded-[50px] hover:opacity-90 disabled:opacity-50"
            >
              <FormattedMessage id="common.save" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-3 rounded-[50px] hover:opacity-90"
            >
              <FormattedMessage id="common.cancel" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUserEdit;
