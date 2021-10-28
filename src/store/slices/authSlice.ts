import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import { RootState } from '../store'
import {User} from "../../interfaces/User"

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuth: false,
        user: {}
    },
    reducers: {
        login: (state, {payload}: PayloadAction<User>) => {
            state.isAuth = true
            state.user = {...payload}
            localStorage.setItem("user", JSON.stringify({...payload}))
        },
        logout: (state) => {
            state.isAuth = false
            state.user = {}
            localStorage.clear()
        }
    },
})

// Action creators are generated for each case reducer function
export const {login, logout} = authSlice.actions
export const authSelector = (state: RootState) => state.auth
export default authSlice.reducer
