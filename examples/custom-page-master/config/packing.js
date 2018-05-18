export default (packing) => {
  const p = packing;

  // 模版输出地址，相对于 `p.path.dist.root` 的相对路径
  p.path.dist.templates.pages = 'templates';

  // 模版类型
  p.template.options.engine = 'html';

  // 模版文件后缀名
  p.template.options.extension = '.html';

  // 关闭 visualizer
  p.visualizer.enabled = false;

  return p;
};
