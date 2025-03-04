/* eslint-disable no-undef */

// 请求方法封装
import service from './base';

export const get = (url, params) => {
  return new Promise((resolve, reject) => {
    service({
      methods: 'GET',
      url,
      params,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const post = (url, data) => {
  return new Promise((resolve, reject) => {
    service({
      methods: 'GET',
      url,
      data,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// 下载
export const downLoad = (url, params) => {
  return new Promise((resolve, reject) => {
    service({
      methods: 'GET',
      url,
      params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      responseType: 'blob',
      // 监听下载进度
      onDownloadProgress(progressEvent) {
        if (progressEvent.lengthComputable) {
          const { loaded, total } = progressEvent;
          const percentComplete = `${(loaded / total) * 100}%`;
          // eslint-disable-next-line no-console
          console.log(percentComplete);
        }
      },
    })
      .then((response) => {
        const mimetype = `${resolve.header['content-type']};charset=utf-8`;
        const blob = new Blob([response.data], { type: mimetype });
        // todo 三种处理方式
        // 1.直接下载
        // downloadFile(fileName, blob);
        // 2.返回链接
        const URL = window.URL || window.webkitURL;
        const href = URL.createObjectURL(blob);
        resolve(href);
        // 3.打开新窗口
        // window.open(href, '_blank');
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// 上传
export const upload = (url, formData) => {
  return new Promise((resolve, reject) => {
    service({
      methods: 'GET',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// eslint-disable-next-line no-unused-vars
function downloadFile(fileName, blob) {
  if ('download' in document.createElement('a')) {
    const link = document.createElement('a');
    link.download = fileName;
    link.style.display = 'none';
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  } else {
    navigator.msSaveBlob(blob, fileName);
  }
}
