process.env.CONTEXT = __dirname;
process.env.NODE_ENV = 'local';

const { getTestCaseName } = require('../../util');

describe(getTestCaseName(), async () => {
  require('./test.serve');
  require('./test.build');
});
