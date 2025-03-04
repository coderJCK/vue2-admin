/* eslint-disable no-undef */
// 大文件上传思路：1.分片、2.并发上传切片 3.服务端合并所有切片 4.支持断点续传和进度显示

// 生成文件切片, 浏览器并发限制通常为 6
function createFileChunk(file, concurrency = 6) {
  const chunks = [];
  const size = Math.ceil(file.size / concurrency);
  let cur = 0;
  while (cur < file.size) {
    // 当我们选中一个文件时，浏览器默认会帮我们将文件转成一个 Blob 对象，
    // Blob 上自带一个 slice 方法, Blob.slice()接受的参数不是下标，而是起始字节，最终字节
    chunks.push(file.slice(cur, cur + size));
    cur += size;
  }
  return chunks.map(({ chunkfile }, index) => {
    return {
      chunkfile,
      size: file.size,
      index,
      fileName: uploadFile.name,
      chunkName: `${uploadFile.name}-${index}`,
      percent: 0,
    };
  });
}

// 封装并发请求
function uploadChunks(chunks) {
  const uploadedChunks = getUploadedChunks(chunks[0], fileName);
  const requests = chunks
    .filter((item) => {
      return uploadedChunks.some((chunk) => chunk.chunkName === item.chunkName);
    })
    .map((chunk) => {
      const formData = new FormData();
      formData.append('fileId', chunk.fileId);
      formData.append('index', chunk.index);
      formData.append('chunkfile', chunk.chunkfile);
      formData.append('chunkName', chunk.chunkName);
      return axios.post({
        url: '/upload',
        data: formData,
        onUploadProgress: () => {
          // todo 下载进度显示
          // chunks[index].percent = parseInt(String(e.loaded / e.total) * 100);
        },
      });
    });
  return Promise.all(requests);
}

// todo, 获取已经上传的片段
function getUploadedChunks(fileName) {
  return axios.get({ url: '/chunks', fileName });
}

// todo, 都上传成功完成后, 发送合并请求
function mergeChunks(fileId) {
  return axios.get({ url: '/upload', data: fileId });
}

// 使用示例
// eslint-disable no-unused-vars
export function handlerUpload(file) {
  // 创建分片
  const uploadChunkList = createFileChunk(file);
  // todo
  return new Promise(() => {
    uploadChunks(uploadChunkList);
    mergeChunks();
  });
}
