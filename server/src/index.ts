import http from 'http';
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import { PostgresDataSource } from './db/data-source';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post';

const PORT = Number(process.env.SERVER_PORT) || 4000;

const main = async () => {
  try {
    await PostgresDataSource.initialize();

    const app = express();
    const httpServer = http.createServer(app);

    const server = new ApolloServer({
      schema: await buildSchema({
        resolvers: [PostResolver],
        validate: false,
      }),
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    app.use(
      '/graphql',
      cors(),
      express.json(),
      expressMiddleware(server, {
        context: async () => ({
          manager: PostgresDataSource.manager,
        }),
      })
    );

    httpServer.listen(PORT, () => {
      dotenv.config();

      console.log(`Server started on port http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(err);

    throw new Error('theres a problem!');
  }
};

main();
