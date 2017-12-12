# Mock GraphQL

在前端开发环境中模拟 GraphQL Server。

## 配置项
和 GraphQL Mock Server 相关的配置有以下几个：

```
// 是否使用GraphQL-mock-server，默认不使用
graphqlMockServer: false,

// GraphQL 地址
graphqlEndpoint: '/graphql',

// GraphiQL 地址
graphiqlEndpoint: '/graphiql'
```

## 使用
1. 在 `config/packing.js` 中启动 GraphQL Mock Server：
    ```
    export default (packing) => {
      const p = packing;
      p.graphqlMockServer = true;
      return p;
    };
    ```
2. 安装 GraphQL Mock Server 需要的依赖包：
    ```
    npm i --dev apollo-server-express graphql-tools merge-graphql-schemas body-parser
    ```
3. 在 `mock` 目录创建 `schema.js`，`schema.js` 可以存在于不同的目录结构，只要文件名为 `schema.js` 的文件 packing 都会加载，这类文件需要找后端开发要，它应该和后端的 schema 文件保持一致。

4. 到这一步，一个简单的 GraphQL Mock Server 就创建好了。GraphQL Mock Server 会根据字段类型返回默认数据：
    ```
    defaultMockMap.set('Int', () => Math.round(Math.random() * 200) - 100);
    defaultMockMap.set('Float', () => Math.random() * 200 - 100);
    defaultMockMap.set('String', () => 'Hello World');
    defaultMockMap.set('Boolean', () => Math.random() > 0.5);
    defaultMockMap.set('ID', () => uuid.v4());
    ```

5. 通常我们需要对字段返回结果有一定的格式要求，这时可以通过自定义 resolver 函数来解决。在 `mock` 目录创建 `resolver.js`，在这里定义每一个字段的返回，不定义的字段还会使用默认值。
    ```
    export default {
      User: () => ({
        name: 'Joe'
      })
    };
    ```
如果需要返回动态数据，可以通过使用一些数据模拟的库，如 [casual](https://github.com/boo1ean/casual)，或者自己编程实现。
    ```
    import { name } from 'casual';

    export default {
      User: (_, { id }) => {
        return {
          id,
          name
        };
      }
    };
    ```

## 启动
```
npm install && npm start
```
启动后可以用这个地址测试：[测试地址][1]

## 测试用的query
```
{
  author(id: 1) {
    id
    name
    posts {
      id
      title
    }
  }
}
```

## 更多内容
- [graphql-tools mocking](https://www.apollographql.com/docs/graphql-tools/mocking.html)


[1]:http://localhost:8081/graphiql?query=%7B%0A%20%20author(id%3A%201)%20%7B%0A%20%20%20%20id%0A%20%20%20%20name%0A%20%20%20%20posts%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20title%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D
