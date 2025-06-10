import axios from "axios";

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || "/api", // API的基础URL
  timeout: 15000, // 请求超时时间
  withCredentials: true, // 跨域请求时是否需要使用凭证
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做一些处理，比如添加token
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`
    // }
    return config;
  },
  (error) => {
    // 处理请求错误
    console.error("请求错误：", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 根据自定义错误码判断请求是否成功
    if (res.code !== undefined && res.code !== 0) {
      // 修改这里，判断code不等于0
      // 处理错误
      console.error("响应错误：", res.message || res.msg || "未知错误");
      // 可以根据错误码做不同的处理
      if (res.code === 401) {
        // 未授权，可能需要重新登录
        console.warn("未授权，请重新登录");
      }
      return Promise.reject(new Error(res.message || res.msg || "未知错误"));
    } else {
      return res;
    }
  },
  (error) => {
    // 处理HTTP错误
    console.error("响应错误：", error);
    return Promise.reject(error);
  }
);

// 封装GET请求
export function get(url, params) {
  return service({
    url,
    method: "get",
    params,
  });
}

// 封装POST请求
export function post(url, data) {
  return service({
    url,
    method: "post",
    data,
  });
}

// 封装PUT请求
export function put(url, data) {
  return service({
    url,
    method: "put",
    data,
  });
}

// 封装DELETE请求
export function del(url, params) {
  return service({
    url,
    method: "delete",
    params,
  });
}

// 导出axios实例
export default service;
