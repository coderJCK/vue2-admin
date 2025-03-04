/* eslint-disable no-bitwise */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// 用于解决移动端下载pdf文件存在的各种兼容性问题
/**
 * 生成ObjectURL
 * @param {object} data
 * @param {string} contentType
 * @param {boolean} forceDataSchema
 * @return {string} url
 */
function createObjectURL(data, contentType = '', forceDataSchema = false) {
  if (URL.createObjectURL && !forceDataSchema) {
    return URL.createObjectURL(
      new Blob([data], {
        type: contentType,
      }),
    );
  }

  const digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let buffer = `data:${contentType};base64,`;

  for (let i = 0, ii = data.length; i < ii; i += 3) {
    const b1 = data[i] & 0xff;
    const b2 = data[i + 1] & 0xff;
    const b3 = data[i + 2] & 0xff;
    const d1 = b1 >> 2;
    const d2 = ((b1 & 3) << 4) | (b2 >> 4);
    const d3 = i + 1 < ii ? ((b2 & 0xf) << 2) | (b3 >> 6) : 64;
    const d4 = i + 2 < ii ? b3 & 0x3f : 64;
    buffer += digits[d1] + digits[d2] + digits[d3] + digits[d4];
  }

  return buffer;
}

/**
 * 下载文件
 * @param {string} blobUrl
 * @param {string} filename
 */
function download(blobUrl, filename) {
  const a = document.createElement('a');

  if (!a.click) {
    throw new Error('DownloadManager: "a.click()" is not supported.');
  }

  a.href = blobUrl;
  a.target = '_parent';

  if ('download' in a) {
    a.download = filename;
  }

  (document.body || document.documentElement).appendChild(a);
  a.click();
  a.remove();
}

/**
 * 下载管理器兼容各种状况
 */
class DownloadManager {
  /** */
  constructor() {
    this.viewerCompatibilityParams = {
      disableCreateObjectURL: false,
    };
    this.initCompatibilityParams();
  }

  /** */
  initCompatibilityParams() {
    const userAgent = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
    const platform = (typeof navigator !== 'undefined' && navigator.platform) || '';
    const maxTouchPoints = (typeof navigator !== 'undefined' && navigator.maxTouchPoints) || 1;
    const isAndroid = /Android/.test(userAgent);
    const isIOS =
      /\b(iPad|iPhone|iPod)(?=;)/.test(userAgent) ||
      (platform === 'MacIntel' && maxTouchPoints > 1);
    const isIOSChrome = /CriOS/.test(userAgent);
    const isQuark = /Quark/.test(userAgent); // 夸克浏览器
    const isQQ = /QQ/.test(userAgent); // QQ浏览器
    const isFirefox = /Firefox/.test(userAgent); // 火狐浏览器
    if (isIOSChrome || isQuark || isQQ || isFirefox) {
      this.viewerCompatibilityParams.disableCreateObjectURL = true;
    }

    if (isIOS || isAndroid) {
      this.viewerCompatibilityParams.maxCanvasPixels = 5242880;
    }
  }

  /**
   * @param {string} blob
   * @param {string} url
   * @param {string} filename
   */
  download(blob, url, filename) {
    if (this.viewerCompatibilityParams.disableCreateObjectURL) {
      this.downloadUrl(url, filename);
      return;
    }
    const blobUrl = URL.createObjectURL(blob);
    download(blobUrl, filename);
  }

  /**
   * @param {string} url
   * @param {string} filename
   */
  downloadUrl(url, filename) {
    download(`${url}#pdfjs.action=download`, filename);
  }

  /**
   * @param {string} data
   * @param {string} filename
   * @param {string} contentType
   */
  downloadData(data, filename, contentType) {
    const blobUrl = createObjectURL(
      data,
      contentType,
      this.viewerCompatibilityParams.disableCreateObjectURL,
    );
    download(blobUrl, filename);
  }

  /**
   * @param {string} data
   * @param {string} filename
   * @return {boolean}
   */
  downloadOrOpen(data, filename) {
    const contentType = 'application/pdf';
    const blobUrl = URL.createObjectURL(data);
    try {
      window.open(`${blobUrl}#${filename}`);
      return true;
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.error(`openOrDownloadData: ${ex}`);
      URL.revokeObjectURL(blobUrl);
    }
    this.downloadData(data, filename, contentType);
    return false;
  }
}

// 下载
const url = '此次为下载pdf的地址';
const downloadMananger = new DownloadManager();
const response = await fetch(url, {
  method: 'GET',
});
const fileName = `此处为pdf的名称.pdf`;
if (response.ok) {
  const blob = await response.blob();
  try {
    downloadMananger.download(blob, url, fileName);
  } catch (error) {
    downloadMananger.downloadUrl(url, fileName);
  }
}

// 通过wx.downloadFile下载临时合同文件，
// 再通过wx.openDocument预览合同
// 点击右上角菜单，保存到手机/存储即可
// function downloadByWx() {
//   const url = 'https://'; // 下载地址
//   const name = 'demo'; // 名称
//   wx.downloadFile({
//     url,
//     filePath: `${wx.env.USER_DATA_PATH}/{name}.pdf`, // 下载后的路径
//     success(result) {
//       if (result.filePath) {
//         wx.openDocument({
//           filePath: result.filePath,
//           fileType: 'pdf',
//           showMenu: true, // 显示右上角菜单，必填
//           success(res) {
//             console.log(res);
//           },
//           fail(res) {
//             console.log(res);
//             wx.showToast({
//               icon: 'none',
//               title: '文件打开失败',
//             });
//           },
//         });
//       }
//     },
//     fail(result) {
//       console.log(result);
//     },
//   });
// }
