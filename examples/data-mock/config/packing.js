/**
 * 这个文件可以修改packing配置文件的默认设置
 * 配置文件的位置在 `node_modules/packing/config/packing.js`
 *
 * @param object packing 默认配置对象
 */

export default (packing) => {
  const p = packing;
  p.path = {
    // 模版目录，如果模版支持继承或layout的话
    // 模板一般会再区分布局文件(layout)和网页文件(pages)
    templates: 'src/templates',

    // 编译后的模版目录，如果模版支持继承或layout的话
    // 模板一般会再区分布局文件(layout)和网页文件(pages)
    // 该变量修改时，需要同步修改pom.xml文件`project.properties.qzz_files`节点值
    // 该目录需要添加到项目根目录下的.gitignore中
    templatesDist: 'prd/templates',

    // 模版网页文件，如果没有使用layout的话，保持这个地址和`templates`一致
    templatesPages: 'src/templates/pages',

    // 编译后的模版网页文件，如果没有使用layout的话，保持这个地址和`templatesDist`一致
    templatesPagesDist: 'prd/templates/pages',
  };
  p.templateEngine = 'pug';
  // 模版文件扩展名
  p.templateExtension = '.pug';

  // URL转发路由规则配置
  // require! 表示使用本地mock文件
  p.rewriteRules = {
    // 网站URL与模版的对应路由关系
    '^/$': '/index.pug',
    // API转发
    '^/api/(.*)': 'require!/mock/api/$1.js',
  };

  return p;
};
