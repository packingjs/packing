删除 packing 默认配置中的一个插件。

# config/webpack.build.babel.js
``` javascript
export default (webpackConfig) => {
  const config = webpackConfig;
  config.plugins = config.plugins.filter(
    plugin => plugin.constructor.name !== 'ExtractTextPlugin'
  );
  return config;
};
```
