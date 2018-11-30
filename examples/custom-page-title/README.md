当网站存在多个网页时，通常希望每个网页有自己的标题，另外为了搜索引擎友好，也希望每个网页有自己的关键字和描述字段，这个需求可以通过增加和 `entrypoint.js` 同名的 `entrypoint.settings.js` 来完成页面定制化。

# 编译前

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

  // 母模版位置
  p.template.options.master = 'src/templates/master.html';

  // 关闭 visualizer
  p.visualizer.enabled = false;

  return p;
};
```

## src/pages/a/entry.settings.js
```javascript
export default {
  title: 'a',
  keywords: 'aa',
  description: 'aaa'
};
```

## src/pages/b/entry.settings.js
```javascript
export default {
  title: 'b',
  keywords: 'bb',
  description: 'bbb'
};
```

## src/templates/master.html
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'>
    <title>__title__</title>
  </head>

  <body></body>
</html>
```

# 编译后

## prd/templates/a.html
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'>
    <title>a</title>
    <meta name="keywords" content="aa">
  <meta name="description" content="aaa">
  </head>

  <body>  <script src="/js/a_46c78f2e.js"></script>
  </body>
</html>
```

## prd/templates/b.html
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'>
    <title>b</title>
    <meta name="keywords" content="bb">
  <meta name="description" content="bbb">
  </head>

  <body>  <script src="/js/b_74fc3508.js"></script>
  </body>
</html>
```
