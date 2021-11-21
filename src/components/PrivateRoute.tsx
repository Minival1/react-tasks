import { Redirect, Route } from 'react-router-dom';
import { routes } from "../data/routes"
import auth from "../store/Auth"

interface PrivateRouteProps {
    component(): JSX.Element,
    requiredRoles: string[],
    path: string
}

const PrivateRoute = ({ component: Component, requiredRoles, ...rest }: PrivateRouteProps) => {

    // @ts-ignore
    const userHasRequiredRole = requiredRoles.includes(auth.user?.role)

    return (
        <Route {...rest} render={(props) => {
            if (!auth.isAuth) {
                return <Redirect push to={{ pathname: routes["login-page"].url, state: { from: props.location } }} />
            }
            return auth.isAuth && userHasRequiredRole ? <Component /> : <Redirect push to={{ pathname: routes["common-page"].url, state: { from: props.location } }} />
        }} />
    )
};

export default PrivateRoute;
