import {Redirect, useLocation} from "react-router-dom";
import {routes} from "../routes";

export const withAuthRedirect = (Component) => {

    const RedirectComponent = (props) => {
        const location = useLocation()
        const user = JSON.parse(localStorage.getItem("user"))

        if (routes[location.pathname.slice(1)]?.access == user.userType) {
        } else if (user.userType === "admin" || user.userType === "user") {
            return <Redirect to={routes.common.url} />
        } else {
            return <Redirect to={routes.login.url} />
            // "redirect in avtorizaciya + posle redirect na ety stranicy"
        }

        return <Component {...props} />
    }

    return RedirectComponent
}
