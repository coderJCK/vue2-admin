// axios 封装
import axios from 'axios';
import { addRequest, removeRequest } from './cancel';
import { handlerHttpError, handlerServerError } from './error';

// 业务成功状态码
const SUCCESS_CODE = '000000';

// 创建实例与基础配置
const service = (options) => {
  axios.create({
    baseURL: '/api',
    timeout: 10000,
    ...options,
  });
};

// 拦截器封装
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
service.interceptors.response.use(
  (response) => {
    // loading关闭

    // 请求成功后，从pendingRequests中移除请求
    removeRequest(response.config);
    // 不同业务状态码处理...
    if (response.data.code === SUCCESS_CODE) {
      return response;
    } else {
      handlerServerError(response.data);
    }
  },
  (error) => {
    // 请求成功后，从pendingRequests中移除请求
    removeRequest(error.config || {});
    // todo loading关闭...

    if (axios.isCancel(error)) {
      // console.log('重复请求被取消', error.message);
    } else {
      // 不同HTTP状态码处理...
      handlerHttpError(error);
    }
    return Promise.reject(error);
  },
);

export default service;
