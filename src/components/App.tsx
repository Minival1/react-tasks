import {BrowserRouter, Route, Switch} from "react-router-dom";
import CommonPage from "../pages/Common-page";
import UserPage from "../pages/User-page";
import AdminPage from "../pages/Admin-page";
import LoginPage from "../pages/Login-page";
import {routes} from "../data/routes"
import PrivateRoute from "./PrivateRoute";
import {ROLE} from "../data/roles"
import Header from "./Header";
import {User} from "../interfaces/User";
import auth from "../store/Auth"
import "./App.css"

const App = () => {

    const user: User = JSON.parse(localStorage.getItem("user")!)

    if (user && !auth.isAuth) {
        auth.login(user)
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
