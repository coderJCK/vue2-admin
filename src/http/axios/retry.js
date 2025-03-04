// 封装请求重试机制，可通过递归调用请求方法
import service from './base';

const requestWithRetry = async (config, retries = 3) => {
  try {
    const response = await service(config);
    return response;
  } catch (error) {
    if (retries > 0) {
      return requestWithRetry(config, retries - 1);
    } else {
      return Promise.reject(error);
    }
  }
};

// 使用示例
const config = {
  method: 'get',
  url: '/some-api',
};
requestWithRetry(config)
  .then(() => {
    //
  })
  .catch(() => {
    //
  });
