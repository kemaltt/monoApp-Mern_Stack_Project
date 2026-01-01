import { createSlice } from '@reduxjs/toolkit';
import { authApi } from './auth-api';

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  token: null,
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
      state.user = action.payload.user; // user objesi içinde role bilgisi var
      state.isAuthenticated = true;
      state.token = action.payload.accessToken;
    });
    builder.addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
    });
    builder.addMatcher(authApi.endpoints.forgotPassword.matchFulfilled, (state, action) => {
      // state.user = action.payload;  
    });
    builder.addMatcher(authApi.endpoints.resetPassword.matchFulfilled, (state, action) => {
      // state.user = action.payload;  
    });
    builder.addMatcher(authApi.endpoints.updateUser.matchFulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});


export default authSlice.reducer;
