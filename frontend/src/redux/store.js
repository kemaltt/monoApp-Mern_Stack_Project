import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authSlice from "./auth/auth-slice";
import transactionSlice from "./transaction/transaction-slice";
import { authApi } from './auth/auth-api'
import { favApi } from "./favorite/favorite-api";
import { transactionApi } from "./transaction/transaction-api";
import { adminApi } from './admin/admin-api';
import { activityLogApi } from './admin/activity-log-api';




const persistConfig = {
  user: {
    key: 'user',
    storage: storage,
    blacklist: ['loading', 'error']
  },
  products: {
    key: 'products',
    storage: storage,
    whitelist: []
  },
  transactions: {
    key: 'transactions',
    storage: storage,
    whitelist: []
  },
  favorite: {
    key: 'favorite',
    storage: storage,
    whitelist: []
  }
}

const rootReducer = combineReducers({
  user: persistReducer(persistConfig.user, authSlice),
  // favorite: persistReducer(persistConfig.favorite, favoriteSlice),
  transactions: persistReducer(persistConfig.transactions,transactionSlice ),
  // cart: persistReducer(persistConfig.cart, cartSlice),
  [authApi.reducerPath]: authApi.reducer,
  // [favApi.reducerPath]: favApi.reducer,
  [transactionApi.reducerPath]: transactionApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [activityLogApi.reducerPath]: activityLogApi.reducer,
  // [cartApi.reducerPath]: cartApi.reducer
});

const middlewares = [authApi.middleware, favApi.middleware, transactionApi.middleware, adminApi.middleware, activityLogApi.middleware];
// const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(middlewares),
  devTools: true
});

export const persistor = persistStore(store)