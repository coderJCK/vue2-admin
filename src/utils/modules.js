// 模块化自动导入，可用于routes、apis、components

/**
 * @description 文件自动导入
 * @param {*} req 文件
 * @param {*} type
 * @returns
 */
export function initModules(req, type = 'js') {
  // 模块名称列表
  const fileNames = req
    .keys()
    .map((item) => item.split('./')[1])
    .map((item) => item.split(`.${type}`)[0]);
  // 模块文件列表
  const files = req.keys().map(req);
  // 添加模块
  const modules = {};
  fileNames.forEach((item, index) => {
    // 此处使用default，所以modules中也需要使用export default
    modules[item] = files[index].default;
  });
  return modules;
}
