import { configureStore } from '@reduxjs/toolkit';
import { alertSlice } from './features/alertSlice';
import { userSlice } from './features/UserSlice';

export default configureStore({
    reducer: {
        alert: alertSlice.reducer,
        user: userSlice.reducer,
    }
})
