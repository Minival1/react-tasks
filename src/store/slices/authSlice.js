import {createSlice} from '@reduxjs/toolkit'

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuth: false,
        user: null
    },
    reducers: {
        login: (state, {payload}) => {
            state.isAuth = true
            state.user = {...payload}
            localStorage.setItem("user", JSON.stringify({...payload}))

        },
        logout: (state) => {
            state.isAuth = false
            state.user = null
            localStorage.clear()
        }
    },
})

// Action creators are generated for each case reducer function
export const {login, logout} = authSlice.actions

export default authSlice.reducer
