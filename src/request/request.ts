import http from "@/request/axios";

//抛出请求
export function request(url: string, method: string, params?: any) {
    url = '/api' + url
    switch (method) {
        case 'get':
            return get(url, params);
        case 'post':
            return post(url, params);
        case 'put':
            return put(url, params);
        case 'delete':
            return del(url, params);
        default:
            return get(url, params);
    }
}

function get(url: string, params?: any) {
    return http.get(url, params)
}

function post(url: string, params?: any) {
    return http.post(url, params)
}

function put(url: string, params?: any) {
    return http.put(url, params)
}

function del(url: string, params?: any) {
    return http.delete(url, params)
}