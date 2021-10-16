import { Redirect, Route } from 'react-router-dom';
import {useSelector} from "react-redux";
import { routes } from "../data/routes"

const PrivateRoute = ({ component: Component, requiredRoles, ...rest }) => {

    const { isAuth, user } = useSelector((state) => state.auth);

    const userHasRequiredRole = requiredRoles.includes(user?.role)

    return (
        <Route {...rest} render={(props) => {
            if (!isAuth) {
                return <Redirect push to={{ pathname: routes["login-page"].url, state: { from: props.location } }} />
            }
            return isAuth && userHasRequiredRole ? <Component /> : <Redirect push to={{ pathname: routes["common-page"].url, state: { from: props.location } }} />
        }} />
    )
};

export default PrivateRoute;
