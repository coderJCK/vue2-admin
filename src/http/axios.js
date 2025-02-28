import axios from 'axios';
import { addRequest, removeRequest } from './axiosCancel';

const service = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在请求开始前，对之前的请求做检查取消操作
    removeRequest(config);
    // 将当前请求添加到pendingRequests对象中
    addRequest(config);

    // token携带处理...
    // 全局loading处理...
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // loading关闭
    // 请求成功后，从pendingRequests中移除请求
    removeRequest(response.config);
    // 不同业务状态码处理...
    return response;
  },
  (error) => {
    // 请求成功后，从pendingRequests中移除请求
    removeRequest(error.config || {});
    // loading关闭...
    if (axios.isCancel(error)) {
      // console.log('重复请求被取消', error.message);
    }
    // 不同HTTP状态码处理...
    // 网络异常处理...
    return Promise.reject(error);
  },
);
