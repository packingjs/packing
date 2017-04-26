/**
 * 这个文件可以修改packing配置文件的默认设置
 * 配置文件的位置在 `node_modules/packing/config/packing.js`
 *
 * @param object packing 默认配置对象
 */
export default (packing) => {
  const p = packing;

  p.commonChunks = {
    vendor: [
      'react',
      'react-dom',
      // 'antd/lib/select',
      // 'antd/lib/checkbox',
      // 'antd/lib/tree',
      // 'antd/lib/table',
      'antd/lib/button',
      // 'antd/lib/icon',
      // 'antd/lib/modal',
    ],
  };

  p.rewriteRules = {
      // 网站URL与模版的对应路由关系
    '^/$': '/index.html',
  };

  return p;
};
