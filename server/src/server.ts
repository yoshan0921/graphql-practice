import express from 'express';
import http from 'http';
import cors from 'cors';
import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer';
import bodyParser from 'body-parser';
import {typeDefs, resolvers} from './graphql/index.js';
import {DocumentNode} from 'graphql';
import {IResolvers} from '@graphql-tools/utils';

const startApolloServer = async (typeDefs: DocumentNode, resolvers: IResolvers) => {
  const app = express();
  const httpServer = http.createServer(app);
  app.use(cors({origin: 'http://localhost:5173'}));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
  });

  await server.start();
  app.use(
    '/graphql',
    bodyParser.json(),
    expressMiddleware(server, {context: async ({req}) => ({token: req.headers.token})}),
  );

  await new Promise<void>(resolve => httpServer.listen({port: 4000}, resolve));
  console.log(`Server ready at http://localhost:4000/graphql`);
};

startApolloServer(typeDefs, resolvers);
