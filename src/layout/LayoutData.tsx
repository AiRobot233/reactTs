import React, {useState} from 'react';
import '@/assets/css/layout.css';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined, UserOutlined
} from '@ant-design/icons';
import {Avatar, Button, Dropdown, Layout, Menu, MenuProps, Modal, theme} from 'antd';
import {clearLocalStorage, getLocalStorage} from "@/utils/ts/localStorage.ts";
import {replaceIcons} from "@/utils/tsx/utils.tsx";
import {findNodeByPath, findPathByKey} from "@/utils/ts/menu.ts";
import {useLocation, useNavigate} from "react-router-dom";
import EditPasswordModal from "@/components/layout/EditPasswordModal.tsx";

const {Header, Sider, Content} = Layout;

const LayoutData = ({children}: { children: any }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const userInfo = getLocalStorage('userInfo')
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    let menu = getLocalStorage('menu');
    menu = replaceIcons(menu)
    const result = findNodeByPath(menu, location.pathname === '/' ? '/home' : location.pathname)
    let defaultSelectedKeys = []
    let defaultOpenKeys = []
    if (result !== null) {
        defaultSelectedKeys = [result.key]
        defaultOpenKeys = result?.parKey == null ? [] : [result?.parKey]
    }

    //点击事件
    const onClick = (e) => {
        const res = findPathByKey(e.key, menu)
        navigate(res.path)
    }

    //修改密码
    const editPassword = () => {
        setIsModalVisible(true)
    }

    //退出登录
    const loginOut = () => {
        Modal.confirm({
            title: '确认退出系统吗？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                clearLocalStorage()
                navigate('/login')
            },
        });
    }

    //下拉菜单
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a onClick={editPassword}>修改密码</a>
            ),
        },
        {
            key: '2',
            label: (
                <a onClick={loginOut}>退出登录</a>
            ),
        },
    ];

    return (
        <>
            <Layout style={{width: '100%', height: '100%'}}>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className="logo" title="测试站点">
                        测试站点
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        items={menu}
                        defaultSelectedKeys={defaultSelectedKeys}
                        defaultOpenKeys={defaultOpenKeys}
                        onClick={onClick}
                    />
                </Sider>
                <Layout>
                    <Header style={{padding: 0, background: colorBgContainer, display: 'flex'}}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        <div className="userTitle">
                            <Dropdown menu={{items}}>
                                <div style={{cursor: 'pointer'}}>
                                    <Avatar size={35} icon={<UserOutlined/>}/>
                                    <span className="user-name">{userInfo.name}</span>
                                </div>
                            </Dropdown>
                        </div>
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            overflowY: 'auto',
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
            </Layout>

            {isModalVisible && <EditPasswordModal visible={isModalVisible} onClose={() => setIsModalVisible(false)}/>}
        </>
    );
};

export default LayoutData;