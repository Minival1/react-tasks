import {Form, Input, Button} from 'antd';
import { useHistory } from "react-router-dom";
import {routes} from "./routes"
import {withAuthRedirect} from "./hoc/auth-redirect";

const LoginPage = () => {

    const history = useHistory()

    const onFinish = (values) => {
        fetch("data/users.json").then(res => res.json())
            .then((res) => {
                if (res[values.login]) {
                    const user = res[values.login]

                    if (user.password === values.password) {

                        const obj = {
                            login: user.login,
                            userType: user.userType
                        }
                        // потом усложнить
                        localStorage.setItem("user", JSON.stringify(obj))
                        // реализовать идти куда он хотел до этого
                        history.push(routes.common.url)
                    }
                }
            })
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <h1>Login Page</h1>

            <Form
                name="basic"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Login"
                    name="login"
                    rules={[{ required: true, message: 'Please input your login!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 1 ,span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default withAuthRedirect(LoginPage)
