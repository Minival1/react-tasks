import {BrowserRouter, Link, Route, Routes, Navigate} from "react-router-dom";
import CommonPage from "./Common-page";
import UserPage from "./User-page";
import AdminPage from "./Admin-page";
import LoginPage from "./Login-page";
import {routes} from "./routes"
import {React, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {login} from "./store/slices/authSlice"
import PrivateRoute from "./PrivateRoute";
import {ROLE} from "./data/roles"
import "./App.css"
import Header from "./components/Header";

const App = () => {

    const {isAuth} = useSelector((store) => store.auth)
    const dispatch = useDispatch()

    const user = JSON.parse(localStorage.getItem("user"))

    if (user && !isAuth) {
        dispatch(login(user))
    }

    return (
        <BrowserRouter>
            <div>
                <Header/>
                <div className="container">
                    <Routes>
                        <PrivateRoute path={routes["common-page"].url} element={<CommonPage/>}
                                      requiredRoles={[ROLE.admin, ROLE.user]}/>
                        <PrivateRoute path={routes["admin-page"].url} element={<AdminPage/>}
                                      requiredRoles={[ROLE.admin]}/>
                        <PrivateRoute path={routes["user-page"].url} element={<UserPage/>} requiredRoles={[ROLE.user]}/>
                        <Route path={routes["login-page"].url} element={<LoginPage/>}/>
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App
