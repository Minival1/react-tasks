import {Link} from "react-router-dom";
import {routes} from "../data/routes"
import { Layout, Menu } from 'antd';

const { Header } = Layout;

const HeaderComponent = () => {

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

    return (
        <Header>
            <Menu theme="dark" mode="horizontal">
                {renderPrivateLinks()}
            </Menu>
        </Header>
    )
}

export default HeaderComponent
