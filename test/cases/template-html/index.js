process.env.CONTEXT = __dirname;

const { getTestCaseName } = require('../../util');

describe(getTestCaseName(), async () => {
  require('./test.serve');
  // require('./test.build');
});
