import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/authSlice"
import React from "react";

export default configureStore({
    reducer: {
        auth: authReducer
    },
})
