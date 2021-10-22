import {Link} from "react-router-dom";
import {routes} from "../data/routes"
import { Layout, Menu, Button } from 'antd';
import {LogoutOutlined} from '@ant-design/icons';
import {logout} from "../store/slices/authSlice";
import {useDispatch} from "react-redux";

const { Header } = Layout;

const HeaderComponent = () => {

    const dispatch = useDispatch()

    const user = JSON.parse(localStorage.getItem("user"))

    const renderPrivateLinks = () => {
        return Object.values(routes).map(route => {
            if (route.roles?.includes(user?.role)) {
                return (
                    <Menu.Item key={route.name}>
                        <Link to={route.url}>{route.name}</Link>
                    </Menu.Item>
                )
            }
        })
    }

    function logoutHandler() {
        dispatch(logout())
    }

    return (
        <Header>
            <Menu theme="dark" mode="horizontal">
                {renderPrivateLinks()}
                {user && <Menu.Item danger={true} onClick={logoutHandler} icon={<LogoutOutlined />}>
                    Logout
                </Menu.Item>}
            </Menu>
        </Header>
    )
}

export default HeaderComponent
