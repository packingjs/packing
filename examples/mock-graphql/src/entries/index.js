/* eslint-disable */
// import './1.css';
// import './2.scss';
// import './3.less';

function testable(target) {
  // eslint-disable-next-line
  target.isTestable = true;
}

@testable
class MyTestableClass {}

console.log(MyTestableClass.isTestable);
console.log('xxx');
