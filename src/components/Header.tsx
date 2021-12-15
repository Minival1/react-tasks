import {Link, useLocation} from "react-router-dom";
import {routes} from "../data/routes"
import { Layout, Menu } from 'antd';
import {LogoutOutlined} from '@ant-design/icons';
import {logout} from "../store/slices/authSlice";
import {useDispatch} from "react-redux";
import {User} from "../interfaces/User";
import {useEffect, useState} from "react";

const { Header } = Layout;

const HeaderComponent = () => {

    const location = useLocation()
    const dispatch = useDispatch()

    const [selectedKey, setSelectedKeys] = useState(findCurrentMenu)

    const user: User = JSON.parse(localStorage.getItem("user")!)

    useEffect(() => {
        setSelectedKeys(findCurrentMenu())
    }, [location])

    function findCurrentMenu() {
        const current = Object.values(routes).find(route => location.pathname.startsWith(route.url))
        return current ? current.name : ""
    }

    const renderPrivateLinks = (): JSX.Element[] => {

        return Object.values(routes)
            .filter(route => route.roles?.includes(user?.role))
            .map(route => (
                <Menu.Item key={route.name} onClick={() => setSelectedKeys(route.name)}>
                    <Link to={route.url}>{route.name}</Link>
                </Menu.Item>
            ))
    }

    function logoutHandler(): void {
        dispatch(logout())
    }

    return (
        <Header>
            <Menu selectedKeys={[selectedKey]} theme="dark" mode="horizontal">
                {renderPrivateLinks()}
                {user && (
                    <Menu.Item
                        danger={true}
                        onClick={logoutHandler}
                        icon={<LogoutOutlined />}
                    >
                        Logout
                    </Menu.Item>
                )}
            </Menu>
        </Header>
    )
}

export default HeaderComponent
