import {BrowserRouter, Route, Switch} from "react-router-dom";
import CommonPage from "../pages/Common-page";
import UserPage from "../pages/User-page";
import AdminPage from "../pages/Admin-page";
import LoginPage from "../pages/Login-page";
import {routes} from "../data/routes"
import {React, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {login} from "../store/slices/authSlice"
import PrivateRoute from "./PrivateRoute";
import {ROLE} from "../data/roles"
import "./App.css"
import Header from "./Header";

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
                    <Switch>
                        <PrivateRoute path={routes["common-page"].url} component={CommonPage}
                                      requiredRoles={[ROLE.admin, ROLE.user]}/>
                        <PrivateRoute path={routes["admin-page"].url} component={AdminPage}
                                      requiredRoles={[ROLE.admin]}/>
                        <PrivateRoute path={routes["user-page"].url} component={UserPage} requiredRoles={[ROLE.user]}/>
                        <Route path={routes["login-page"].url} component={LoginPage}/>
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App
