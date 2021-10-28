import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/authSlice"
import roomReducer from "./slices/roomSlice"

const store = configureStore({
    reducer: {
        auth: authReducer,
        room: roomReducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
