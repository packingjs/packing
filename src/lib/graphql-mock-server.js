import { resolve } from 'path';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import { mergeTypes, mergeResolvers, fileLoader } from 'merge-graphql-schemas';
import bodyParser from 'body-parser';

export default (app, options) => {
  const { graphqlEndpoint, graphiqlEndpoint } = options;
  try {
    let typesArray = '';
    let mocks = {};
    try {
      typesArray = fileLoader(resolve('mock/**/schema.js'));
      mocks = mergeResolvers(fileLoader(resolve('mock/**/resolver.js')));
    } catch (e) {
      console.log(e);
    }

    try {
      const schema = makeExecutableSchema({ typeDefs: mergeTypes(typesArray) });
      addMockFunctionsToSchema({ schema, mocks });
      app.use(graphqlEndpoint, bodyParser.json(), graphqlExpress(() => ({ schema })));
      app.use(graphiqlEndpoint, graphiqlExpress({
        endpointURL: graphqlEndpoint,
        query: ''
      }));
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log('\n缺少依赖包，请先安装 npm i --dev apollo-server-express graphql-tools merge-graphql-schemas body-parser \n');
    process.exit(1);
  }
};
