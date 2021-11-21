import {Link} from "react-router-dom";
import {routes} from "../data/routes"
import { Layout, Menu } from 'antd';
import {LogoutOutlined} from '@ant-design/icons';
import uuid from 'react-uuid'
import {User} from "../interfaces/User";
import auth from "../store/Auth"

const { Header } = Layout;

const HeaderComponent = () => {

    const user: User = JSON.parse(localStorage.getItem("user")!)

    const renderPrivateLinks = (): JSX.Element[] => {

        return Object.values(routes)
            .filter(route => route.roles?.includes(user?.role))
            .map(route => (
                <Menu.Item key={uuid()}>
                    <Link to={route.url}>{route.name}</Link>
                </Menu.Item>
            ))
    }

    function logoutHandler(): void {
        auth.logout()
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
