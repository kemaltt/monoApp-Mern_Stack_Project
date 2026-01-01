import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useGetAllUsersQuery } from '../redux/admin/admin-api';
import Loading from '../components/common/Loading';
import { format } from 'date-fns';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';

const Admin = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetAllUsersQuery();

  const users = data?.data || [];

  const handleViewLogs = () => {
    navigate('/admin/activity-logs');
  };

  const handleBackToProfile = () => {
    navigate('/profile');
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: () => intl.formatMessage({ id: 'admin.userName' }),
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'email',
        header: () => intl.formatMessage({ id: 'admin.email' }),
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'status',
        header: () => intl.formatMessage({ id: 'admin.status' }),
        cell: info => {
          const status = info.getValue();
          return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
              ${status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : ''}
              ${status === 'passive' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : ''}
              ${status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' : ''}
              ${status === 'deleted' ? 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100' : ''}
            `}>
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'license_type',
        header: () => intl.formatMessage({ id: 'admin.licenseType' }),
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'createdAt',
        header: () => intl.formatMessage({ id: 'admin.registeredAt' }),
        cell: info => info.getValue() ? format(new Date(info.getValue()), 'dd.MM.yyyy HH:mm') : '-',
      },
      {
        accessorKey: 'lastLogin',
        header: () => intl.formatMessage({ id: 'admin.lastLogin' }),
        cell: info => info.getValue() ? format(new Date(info.getValue()), 'dd.MM.yyyy HH:mm') : '-',
      },
      {
        id: 'actions',
        header: () => intl.formatMessage({ id: 'admin.actions' }),
        cell: ({ row }) => (
          <button
            onClick={() => navigate(`/admin/users/${row.original._id}`)}
            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <FormattedMessage id="common.edit" />
          </button>
        ),
      },
    ],
    [intl, navigate]
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="h-9 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="flex gap-3">
              <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                      <th key={i} className="px-6 py-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(row => (
                    <tr key={row}>
                      {[1, 2, 3, 4, 5, 6, 7].map(col => (
                        <td key={col} className="px-6 py-4">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-500 dark:text-red-400">
            {error?.data?.message || 'Failed to load users'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            <FormattedMessage id="admin.title" />
          </h1>
          <div className="flex gap-3">
            <button
              onClick={handleBackToProfile}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              ← Profile
            </button>
            <button
              onClick={handleViewLogs}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <FormattedMessage id="admin.logs.title" />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() && (
                            <span>{header.column.getIsSorted() === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                {'<<'}
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                {'<'}
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                {'>'}
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                {'>>'}
              </button>
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
            >
              {[10, 20, 30, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
