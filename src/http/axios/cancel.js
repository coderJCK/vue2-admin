// 请求取消封装
import axios from 'axios';

// 正在进行的请求的字典
const pendingRequests = new Map();

// 生成请求的唯一标识符，这里简单使用url和方法组合
function generateReqKey(config) {
  return `${config.url}&${config.method}`;
}
// 添加请求
export function addRequest(config) {
  const requestKey = generateReqKey(config);
  // eslint-disable-next-line no-param-reassign
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingRequests.has(requestKey)) {
        pendingRequests.set(requestKey, cancel);
      }
    });
}
// 移除请求
export function removeRequest(config) {
  const requestKey = generateReqKey(config);
  if (pendingRequests.has(requestKey)) {
    const cancel = pendingRequests.get(requestKey);
    cancel(requestKey);
    pendingRequests.delete(requestKey);
  }
}
