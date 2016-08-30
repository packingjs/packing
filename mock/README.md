# mock

该目录主要存放网站本地开发时需要的模拟数据，模拟数据有两类：

1. 网页ajax异步请求的数据接口返回数据，这类数据放在 [api](api) 目录，目录位置也可以通过 [packing.js](../config/packing.js) 文件来配置
2. 模版文件渲染页面初始化数据，这类数据放在 [pages](pages) 目录，目录位置不可改变，文件的目录层级与 [templates/pages](templates/pages) 下网页模版文件一一对应

模拟数据文件可以会接收2个参数：

1. `request`: HTTP request请求，这里可以拿到请求提交过来的参数、cookie等

2. `response`: HTTP response相应，可以控制response来实现返回json数据、修改cookie、发送错误码、重定向等功能
