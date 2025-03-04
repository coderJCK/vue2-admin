// 错误码处理
export const ERROR_TOKEN_NULL = 500001; // token不存在
export const ERROR_TOKEN_INVALID = 500002; // token无效
export const ERROR_TOKEN_EXPIRED = 500003; // token过期
export const ERROR_ACCOUNT_NULL = 500004; // 账号不存在
export const ERROR_ACCOUNT_DISABLED = 500005; // 账号禁用

// 业务错误码封装
export const handlerServerError = (error) => {
  if (!error.code) return;
  const { message, code } = error;
  // todo 页面报错显示(一般使用el-message或者el-notification)
  // eslint-disable-next-line no-undef, no-console
  console.log(code, message);

  // 根据不同业务状态码，处理不同逻辑，如退出登录
  const loginOutHandlers = [
    ERROR_TOKEN_NULL,
    ERROR_TOKEN_INVALID,
    ERROR_TOKEN_EXPIRED,
    ERROR_ACCOUNT_NULL,
    ERROR_ACCOUNT_DISABLED,
  ];
  if (loginOutHandlers.includes(code)) {
    // todo 退出登录逻辑处理
  } else {
    // todo 其他逻辑处理
  }
};

// http错误码封装
export const handlerHttpError = (error) => {
  if (!error.response) return;
  const curErrorCode = error.response.status;
  const errorCodes = [
    { code: 400, message: '' },
    { code: 401, message: '用户没有权限(令牌、用户名、密码错误)' },
    { code: 403, message: '用户得到授权，但访问被禁止' },
    { code: 404, message: '网络请求错误,未找到该资源!' },
    { code: 405, message: '网络请求错误,请求方法未允许!' },
    { code: 500, message: '服务器错误,请联系管理员!' },
    { code: 501, message: '网络未实现!' },
    { code: 502, message: '网络错误!' },
    { code: 503, message: '服务不可用，服务器暂时过载或维护!' },
    { code: 504, message: '网络超时' },
    { code: 505, message: 'http版本不支持该请求!' },
  ];
  const index = errorCodes.findIndex((item) => item.code === curErrorCode);
  let message = '';
  if (index > -1) {
    message = errorCodes[index].message;
  } else {
    message = '网络错误';
  }
  // todo 页面报错显示(一般使用el-message或者el-notification)
  // eslint-disable-next-line no-undef, no-console
  console.log(message);
};
