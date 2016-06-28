console.log('client2');
console.log('=======');
console.log(require('./config'));
console.log('=======z');

require.ensure([], (require) => {
  require('./3');
});
