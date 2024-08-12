import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.tsx'
import {BrowserRouter} from "react-router-dom";
import AuthRoute from "@/components/auth/AuthRoute";
import '@/assets/css/index.css';
import zhCN from 'antd/locale/zh_CN';
import {ConfigProvider} from "antd";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <AuthRoute>
            <ConfigProvider locale={zhCN}>
                <App/>
            </ConfigProvider>
        </AuthRoute>
    </BrowserRouter>
)
