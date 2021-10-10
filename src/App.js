import {BrowserRouter, Link, Route, Switch, useHistory, useLocation, Redirect} from "react-router-dom";
import CommonPage from "./Common-page";
import UserPage from "./User-page";
import AdminPage from "./Admin-page";
import LoginPage from "./Login-page";
import {routes} from "./routes"
import "./App.css"
import React from "react";

const App = () => {

    return (
        <BrowserRouter>
            <div className="container">
                <div>
                    <nav>
                        <ul>
                            <li>
                                <Link to={routes.common.url}>Common</Link>
                            </li>
                            <li>
                                <Link to={routes.admin.url}>Admin</Link>
                            </li>
                            <li>
                                <Link to={routes.user.url}>User</Link>
                            </li>
                            <li>
                                <Link to={routes.login.url}>Login</Link>
                            </li>
                        </ul>
                    </nav>

                    {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                    <Switch>
                        <Route path={routes.common.url} render={CommonPage}>
                        </Route>
                        <Route path={routes.admin.url} render={AdminPage}>
                        </Route>
                        <Route path={routes.user.url} render={UserPage}>
                        </Route>
                        <Route path={routes.login.url} render={LoginPage}>
                        </Route>
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App
