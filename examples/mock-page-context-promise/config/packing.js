/**
 * 这个文件可以修改packing配置文件的默认设置
 * 默认配置请看 `node_modules/packing/config/packing.js`
 *
 * @param object packing 默认配置对象
 */

export default (packing) => {
  const p = packing;
  // 模版引擎类型，目前支持的类型有[html,pug,ejs,handlebars,smarty,velocity,artTemplate]
  p.templateEngine = 'pug';
  // 模版文件扩展名
  p.templateExtension = '.pug';
  // 网站自定义配置
  p.rewriteRules = {
    // 网站URL与模版的对应路由关系
    '^/$': '/index.pug',
    // API转发
    '^/api/(.*)': 'require!/mock/api/$1.js'
  };

  return p;
};
