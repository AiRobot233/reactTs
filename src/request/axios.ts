import axios from "axios";
import {message} from "antd";
import {getToken} from "@/utils/ts/localStorage";


// 创建axios实例
const http = axios.create({
    baseURL: '', // 基础URL
    timeout: 10000, // 请求超时时间
    // 其他配置...
});

// 请求拦截器
http.interceptors.request.use(
    config => {
        // 可以在这里添加例如token等请求头
        config.headers['Authorization'] = getToken();
        return config;
    },
    error => {
        // 请求错误处理
        return Promise.reject(error);
    }
);

// 响应拦截器
http.interceptors.response.use(
    response => {
        //处理200但是error等于一
        if (response.data.error === 1) {
            message.error(response.data.message)
            return Promise.reject(response.data.message);
        }
        // 对响应数据做处理，例如只返回data部分
        return response.data;
    },
    error => {
        if (error.response.status === 500) {
            message.error('服务器错误！')
        }
        if (error.response.status === 404) {
            message.error('接口未找到！')
        }
        if (error.response.status === 401) {
            message.error('登录已失效，请重新登录！')
        }
        if (error.response.status === 412) {
            message.error(error.response.data.message)
        }
        // 响应错误处理
        return Promise.reject(error);
    }
);

export default http;