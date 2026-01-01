import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllActivityLogsQuery } from '../redux/admin/activity-log-api';
import { useIntl, FormattedMessage } from 'react-intl';
import { format } from 'date-fns';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';

const AdminActivityLogs = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [filters, setFilters] = useState({
    action: '',
    resourceType: '',
  });

  const { data, isLoading, error } = useGetAllActivityLogsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...filters,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'userName',
        header: () => intl.formatMessage({ id: 'admin.userName' }),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'action',
        header: () => intl.formatMessage({ id: 'admin.logs.action' }),
        cell: (info) => {
          const action = info.getValue();
          const actionColors = {
            create: 'bg-green-100 text-green-800',
            update: 'bg-blue-100 text-blue-800',
            delete: 'bg-red-100 text-red-800',
            login: 'bg-purple-100 text-purple-800',
            logout: 'bg-gray-100 text-gray-800',
            register: 'bg-yellow-100 text-yellow-800',
          };
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${actionColors[action] || 'bg-gray-100 text-gray-800'}`}>
              {intl.formatMessage({ id: `admin.logs.action${action.charAt(0).toUpperCase()}${action.slice(1)}` })}
            </span>
          );
        },
      },
      {
        accessorKey: 'resourceType',
        header: () => intl.formatMessage({ id: 'admin.logs.resourceType' }),
        cell: (info) => {
          const resourceType = info.getValue();
          return intl.formatMessage({ id: `admin.logs.resource${resourceType.charAt(0).toUpperCase()}${resourceType.slice(1)}` });
        },
      },
      {
        accessorKey: 'details',
        header: () => intl.formatMessage({ id: 'admin.logs.details' }),
        cell: (info) => {
          const details = info.getValue();
          if (!details || Object.keys(details).length === 0) return '-';
          return (
            <div className="text-xs text-gray-600">
              {details.amount && <div>Amount: {details.amount}</div>}
              {details.name && <div>Name: {details.name}</div>}
              {details.income !== undefined && <div>Type: {details.income ? 'Income' : 'Expense'}</div>}
            </div>
          );
        },
      },
      {
        accessorKey: 'ipAddress',
        header: () => intl.formatMessage({ id: 'admin.logs.ipAddress' }),
        cell: (info) => info.getValue() || '-',
      },
      {
        accessorKey: 'createdAt',
        header: () => intl.formatMessage({ id: 'admin.logs.timestamp' }),
        cell: (info) => {
          const date = info.getValue();
          return date ? format(new Date(date), 'dd.MM.yyyy HH:mm') : '-';
        },
      },
    ],
    [intl]
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    pageCount: data?.pagination?.totalPages ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">
          <FormattedMessage id="loading" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">
          <FormattedMessage id="error" />: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          <FormattedMessage id="admin.logs.title" />
        </h1>
        <button
          onClick={() => navigate('/admin')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          ← <FormattedMessage id="admin.title" />
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FormattedMessage id="admin.logs.action" />
          </label>
          <select
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="">
              <FormattedMessage id="admin.logs.allActions" />
            </option>
            <option value="create">
              <FormattedMessage id="admin.logs.actionCreate" />
            </option>
            <option value="update">
              <FormattedMessage id="admin.logs.actionUpdate" />
            </option>
            <option value="delete">
              <FormattedMessage id="admin.logs.actionDelete" />
            </option>
            <option value="login">
              <FormattedMessage id="admin.logs.actionLogin" />
            </option>
            <option value="register">
              <FormattedMessage id="admin.logs.actionRegister" />
            </option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FormattedMessage id="admin.logs.resourceType" />
          </label>
          <select
            value={filters.resourceType}
            onChange={(e) => setFilters({ ...filters, resourceType: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="">
              <FormattedMessage id="admin.logs.allResources" />
            </option>
            <option value="transaction">
              <FormattedMessage id="admin.logs.resourceTransaction" />
            </option>
            <option value="user">
              <FormattedMessage id="admin.logs.resourceUser" />
            </option>
            <option value="auth">
              <FormattedMessage id="admin.logs.resourceAuth" />
            </option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() ? (header.column.getIsSorted() === 'desc' ? ' ↓' : ' ↑') : ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {'<'}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {'>>'}
          </button>
          <span className="ml-4">
            <FormattedMessage id="admin.page" /> {table.getState().pagination.pageIndex + 1} <FormattedMessage id="admin.of" />{' '}
            {table.getPageCount()}
          </span>
        </div>
        <div>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border rounded px-3 py-1"
          >
            {[10, 20, 30, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                <FormattedMessage id="admin.show" /> {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Total count */}
      {data?.pagination && (
        <div className="mt-4 text-sm text-gray-600">
          <FormattedMessage id="admin.logs.totalLogs" />: {data.pagination.total}
        </div>
      )}
    </div>
  );
};

export default AdminActivityLogs;
