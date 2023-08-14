import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import userReducser from './reducers/userReducser';
import searchReducer from './reducers/searchReducer';
import sidebarReducer from './reducers/sidebarReducer';
import chatReducer from './reducers/chatReducer';
const loggerMiddleware = (store) => (next) => (action) => {
    return next(action);
};
export const store = configureStore({
    reducer: {
        user: userReducser,
        search: searchReducer,
        sidebar: sidebarReducer,
        chat: chatReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
}); setupListeners(store.dispatch);