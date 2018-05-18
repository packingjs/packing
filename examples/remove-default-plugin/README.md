# remove-default-plugin

删除 packing 默认配置中的一个插件，同理可以增加或者修改默认插件。

## config/webpack.build.babel.js
``` javascript
export default (webpackConfig) => {
  const config = webpackConfig;
  config.plugins = config.plugins.filter(
    plugin => plugin.constructor.name !== 'VisualizerPlugin'
  );
  return config;
};
```
