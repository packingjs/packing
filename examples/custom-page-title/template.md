当网站存在多个网页时，通常希望每个网页有自己的标题，另外为了搜索引擎友好，也希望每个网页有自己的关键字和描述字段，这个需求可以通过增加和 `entrypoint.js` 同名的 `entrypoint.settings.js` 来完成页面定制化。

# 编译前

## config/packing.js
```javascript
{{config/packing.js}}
```

## src/pages/a/entry.settings.js
```javascript
{{src/pages/a/entry.settings.js}}
```

## src/pages/b/entry.settings.js
```javascript
{{src/pages/b/entry.settings.js}}
```

## src/templates/master.html
```html
{{src/templates/master.html}}
```

# 编译后

## prd/templates/a.html
```html
{{prd/templates/a.html}}
```

## prd/templates/b.html
```html
{{prd/templates/b.html}}
```
