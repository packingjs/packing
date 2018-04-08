// 导入 es6 模块
export default (file) => {
  const module = require(file);
  if (module.default) {
    return module.default;
  }
  return module;
};
