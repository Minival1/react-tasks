import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/authSlice"
import roomReducer from "./slices/roomSlice"

const store = configureStore({
    reducer: {
        auth: authReducer,
        room: roomReducer
    }
})

export type RootState = ReturnType<typeof store.getState>

export default store
