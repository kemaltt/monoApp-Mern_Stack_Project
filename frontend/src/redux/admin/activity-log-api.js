import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../../api/api';

export const activityLogApi = createApi({
  reducerPath: 'activityLogApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['ActivityLogs'],
  endpoints: (builder) => ({
    getAllActivityLogs: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.userId) queryParams.append('userId', params.userId);
        if (params.action) queryParams.append('action', params.action);
        if (params.resourceType) queryParams.append('resourceType', params.resourceType);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);

        return `/admin/activity-logs?${queryParams.toString()}`;
      },
      providesTags: ['ActivityLogs'],
    }),
    getUserActivityStats: builder.query({
      query: (userId) => `/admin/activity-logs/stats/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'ActivityLogs', id: userId }],
    }),
  }),
});

export const {
  useGetAllActivityLogsQuery,
  useGetUserActivityStatsQuery,
} = activityLogApi;
