module.exports = {
  extends: [
    'eslint-config-qunar/base'
  ].map(require.resolve),
  env: {
    mocha: true
  },
  rules: {
    complexity: 0,
    "no-unused-vars": ["error", { "varsIgnorePattern": "should" }]
  }
};
