import { foo } from '../a';
import b from '../b';
// import { Button } from 'antd';

[1, 2, 3].forEach((id) => {
  // 动态加载
  import(`../a${id}`).then((s) => {
    console.log(s);
  });
});

document.getElementById('output').innerHTML = foo() + b;
