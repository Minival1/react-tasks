import {Form, Input, Button} from 'antd';
import { useHistory } from "react-router-dom";
import {useDispatch} from "react-redux";
import {login} from "../store/slices/authSlice";

const LoginPage = () => {

    const history = useHistory()
    const dispatch = useDispatch()

    const onFinish = (values) => {
        fetch("data/users.json").then(res => res.json())
            .then((res) => {
                if (res[values.login]) {
                    const user = res[values.login]

                    if (user.password === values.password) {

                        const obj = {
                            login: user.login,
                            role: user.role
                        }
                        dispatch(login(obj))
                        history.goBack()
                    }
                }
            })
    };

    return (
        <>
            <h1>Login Page</h1>

            <Form
                name="basic"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
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

export default LoginPage
