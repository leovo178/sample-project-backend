const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { scopePerRequest } = require('awilix-express');
const graphqlHTTP = require('express-graphql');
const { graphqlUploadExpress } = require('graphql-upload');
const expressPlayground = require('graphql-playground-middleware-express').default;

const schema = require('./modules');
const router = require('./http/router');

/**
 *
 * @param container
 * @returns {*|Express}
 */
module.exports = (container) => {
  const config = container.resolve('config');
  const app = express();
  app.use(bodyParser.json());
  app.use(scopePerRequest(container));
  app.use(cors());
  app.use('/api', router);
  app.use('/graphql', graphqlUploadExpress(config.graphqlUploadExpress), graphqlHTTP((req) => ({
    schema,
    graphiql: config.app.env === 'development',
    context: { container: req.container, req }, // bind http request context to graphQl context
  })));
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));
  return app;
};
