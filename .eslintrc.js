module.exports = {
  extends: [
    'eslint-config-qunar/base'
  ].map(require.resolve),
  env: {
    mocha: true
  },
  rules: {
    complexity: 0,
    "global-require": 0,
    "no-unused-vars": ["error", { "varsIgnorePattern": "should" }],
    "import/no-dynamic-require": 0,
    "import/prefer-default-export": 0
  }
};
