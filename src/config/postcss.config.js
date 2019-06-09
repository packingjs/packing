module.exports = {
  plugins: {
    // autoprefixer: {
    //   browsers: 'last 5 version'
    // },

    // 使用 nano 压缩 css
    // css-loader@>1.0 内置不支持压缩功能
    // @see https://github.com/webpack-contrib/css-loader/releases/tag/v1.0.0
    nano: process.env.NODE_ENV === 'local' ? false : {}
  }
};
