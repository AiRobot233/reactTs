import '@/assets/css/login.css';
import type {FormProps} from 'antd';
import {Button, Form, Input} from 'antd';
import {request} from "@/request/request";
import {setLocalStorage, setToken} from "@/utils/ts/localStorage";
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {useNavigate} from "react-router-dom";
import {addRoutes} from "@/router/modules";

type FieldType = {
    name?: string;
    password?: string;
};


export default function Login() {
    const navigate = useNavigate()

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        request('/admin/login', 'post', values).then(res => {
            setToken(res.data.token)
            setLocalStorage('userInfo', res.data.user)//登录成功保存user
            request('/admin/routes', 'get').then(async res => {
                addRoutes(res.data.routes)
                setLocalStorage('setRouters', res.data.routes)//登录成功保存user
                navigate('/home')
            }).catch(() => {
            })
        }).catch(() => {
        })
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="body-content">
            <div className="title">
                <h1>测试站点</h1>
            </div>
            <div className="form">
                <Form
                    name="basic"
                    wrapperCol={{offset: 4, span: 12}}
                    style={{width: 600}}
                    initialValues={{name: 'root', password: '123456'}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        name="name"
                        rules={[{required: true, message: '请输入账号!'}]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="请输入账号"/>
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="password"
                        rules={[{required: true, message: '请输入密码!'}]}
                    >
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>}
                                        placeholder="请输入密码"/>
                    </Form.Item>

                    <Form.Item wrapperCol={{offset: 4, span: 12}}>
                        <Button type="primary" htmlType="submit" style={{width: '100%'}}>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
