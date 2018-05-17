export default (webpackConfig) => {
  const config = webpackConfig;
  config.plugins = config.plugins.filter(
    plugin => plugin.constructor.name !== 'VisualizerPlugin'
  );
  return config;
};
