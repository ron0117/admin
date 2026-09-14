// 获取环境变量
import axios from 'axios';

// 获取环境变量，如果未定义则给一个默认空字符串
const OTHER_BASE_URL = import.meta.env.VITE_SERVICE_MOCK_BASE_URL || '';

/**
 * 创建专门用于访问其他服务的 axios 实例
 */
const otherService = axios.create({
  baseURL: OTHER_BASE_URL,
  timeout: 10000 // 请求超时时间
});

// 可以单独为这个实例设置请求拦截器
otherService.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么，例如单独的 Token 处理
    // const token = getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 可以单独为这个实例设置响应拦截器
otherService.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response.data;
  },
  error => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default otherService;
