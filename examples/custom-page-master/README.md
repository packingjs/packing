# custom-page-master

网站的页面结构存在多样化，通常开发者会根据页面结构对页面分组，每一组页面使用一个母模版页面。这个多母模版需求可以通过增加和 `entrypoint.js` 同名的 `entrypoint.settings.js` 来完成页面定制化。

## config/packing.js
```javascript
export default (packing) => {
  const p = packing;

  // 模版输出地址，相对于 `p.path.dist.root` 的相对路径
  p.path.dist.templates.pages = 'templates';

  // 模版类型
  p.template.options.engine = 'html';

  // 模版文件后缀名
  p.template.options.extension = '.html';

  // 关闭 visualizer
  p.visualizer.enabled = false;

  return p;
};
```

## src/pages/a/entry.settings.js
```javascript
export default {
  master: 'src/templates/master/A.html'
};
```

## src/pages/b/entry.settings.js
```javascript
export default {
  master: 'src/templates/master/B.html'
};
```

## src/templates/master/A.html
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'>
  </head>

  <body>
    <h1>Master A</h1>
  </body>
</html>
```

## src/templates/master/B.html
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'>
  </head>

  <body>
    <h1>Master B</h1>
  </body>
</html>
```

## prd/templates/a.html
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'>
  </head>

  <body>
    <h1>Master A</h1>
    <script src="/js/a_e748a171.js"></script>
  </body>
</html>
```

## prd/templates/b.html
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'>
  </head>

  <body>
    <h1>Master B</h1>
    <script src="/js/b_a3c117a7.js"></script>
  </body>
</html>
```
