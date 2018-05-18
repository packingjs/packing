# {{subject}}

网站的页面结构存在多样化，通常开发者会根据页面结构对页面分组，每一组页面使用一个母模版页面。这个多母模版需求可以通过增加和 `entrypoint.js` 同名的 `entrypoint.settings.js` 来完成页面定制化。

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

## src/templates/master/A.html
```html
{{src/templates/master/A.html}}
```

## src/templates/master/B.html
```html
{{src/templates/master/B.html}}
```

## prd/templates/a.html
```html
{{prd/templates/a.html}}
```

## prd/templates/b.html
```html
{{prd/templates/b.html}}
```
