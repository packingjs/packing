# Examples: mock-page-context-promise

该例子演示了使用第三方数据初始化页面模版变量。

这类数据放在 `mock/pages` 目录，文件的目录结构和模版文件的目录结构保存一致。目录位置也可以通过 [packing.js](../../config/packing.js#L128) 文件来配置

## 参数
模拟数据文件可以会接收2个参数：

### request
HTTP request请求，通过该参数可以拿到请求提交过来的参数、cookie等

### response
HTTP response相应，可以控制该参数来实现返回json数据、修改cookie、发送错误码、重定向等功能

## 返回值
返回 `response` 对象
