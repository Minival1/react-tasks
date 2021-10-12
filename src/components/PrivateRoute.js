import { Navigate, Route, useLocation } from 'react-router-dom';
import {useSelector} from "react-redux";
import { routes } from "../data/routes"

const PrivateElement = ({ element, requiredRoles }) => {
    const location = useLocation();

    const { isAuth, user } = useSelector((state) => state.auth);

    if (!isAuth) {
        return <Navigate to={routes["login-page"].url} state={{ from: location }} />
    }

    const userHasRequiredRole = requiredRoles.includes(user.role)

    return isAuth && userHasRequiredRole ? element : <Navigate to={routes["common-page"].url} />;
};

export const PrivateRoute = ({ element, requiredRoles, ...rest }) => {
    return <Route {...rest} element={<PrivateElement requiredRoles={requiredRoles} element={element} />} />;
};

export default PrivateRoute;
