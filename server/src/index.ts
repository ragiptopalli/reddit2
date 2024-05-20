import http from 'http';
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import pgDataSource from './db/data-source';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './db/resolvers/post';
import { UserResolver } from './db/resolvers/user';

import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import session from 'express-session';

const PORT = process.env.SERVER_PORT || 4000;

let redisClient = createClient();

const main = async () => {
  try {
    await pgDataSource.initialize();
    redisClient.connect();

    const app = express();
    const httpServer = http.createServer(app);

    const redisStore = new RedisStore({
      client: redisClient,
      prefix: 'reddit2:',
      disableTouch: true,
    });

    app.use(
      session({
        store: redisStore,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years,
          httpOnly: true,
          sameSite: 'lax',
          secure: false,
          // secure: process.env.NODE_ENV === 'production', //cookie only works in https
        },
        resave: false, // required: force lightweight session keep alive (touch)
        saveUninitialized: false, // recommended: only save session when data exists
        secret: process.env.REDIS_CLIENT_SECRET,
      })
    );

    const server = new ApolloServer({
      schema: await buildSchema({
        resolvers: [PostResolver, UserResolver],
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
        context: async ({ req, res }) => ({
          manager: pgDataSource.manager,
          req,
          res,
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
