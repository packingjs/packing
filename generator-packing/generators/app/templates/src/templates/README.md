# templates
该目录存放服务器端渲染的模版文件，根据模版的特点，目录结构略有不同：

- 如果模版支持继承(如pug)或支持布局(如velocity)的话，就将继承基类文件和布局文件放在 [layout](layout)目录，页面模版放在[pages](pages)目录
- 如果模版不支持继承和布局的话，就将页面模版放在当前目录即可
- 模版位置可以修改文件 [packing.js](../config/packing.js#L18-L33) 来配置
