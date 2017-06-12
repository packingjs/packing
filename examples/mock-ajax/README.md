# Examples: mock-page-context-global

该例子演示了使用全局变量初始化页面模版变量。

这个数据放在 `mock/pages/__global.js`。这个的好处是如果多个文件都需要某些公共变量时，只需要在__global.js中写一次就够了，当然，你在mock文件中使用require也能完成类似的功能。

## 参数
模拟数据文件可以会接收2个参数：

### request
HTTP request请求，通过该参数可以拿到请求提交过来的参数、cookie等

### response
HTTP response相应，可以控制该参数来实现返回json数据、修改cookie、发送错误码、重定向等功能

## 返回值
返回 `response` 对象
