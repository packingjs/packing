// eslint-disable-next-line
const profile = require('env-alias');

// 设置通用配置，会被所在环境配置覆盖
const common = {
};

export default Object.assign({}, common, profile);
