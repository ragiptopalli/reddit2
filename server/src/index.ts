import http from 'http';
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import dataSource from './typeorm/data-source';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import RedisStore from 'connect-redis';
import Redis from 'ioredis';
import session from 'express-session';
import { COOKIE_NAME } from './constants';
import { createSchema } from './schema';

const PORT = process.env.SERVER_PORT || 4000;

const main = async () => {
  await dataSource.initialize();

  // uncomment this to run the mock data migration
  // await dataSource.runMigrations();

  const app = express();
  const httpServer = http.createServer(app);

  app.get('/', function (_, res) {
    res.send('<h1>Hey!, not allowed here!!!</h1>');
  });

  const redis = new Redis();
  const redisStore = new RedisStore({
    client: redis,
    prefix: 'reddit2:',
    disableTouch: true,
  });

  app.use(
    session({
      name: COOKIE_NAME,
      store: redisStore,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years,
        httpOnly: true,
        sameSite: 'lax', //csrf
        secure: process.env.NODE_ENV === 'production', //cookie only works in https
      },
      resave: false, // required: force lightweight session keep alive (touch)
      saveUninitialized: false, // recommended: only save session when data exists
      secret: process.env.REDIS_CLIENT_SECRET,
    })
  );

  const server = new ApolloServer({
    schema: await createSchema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        req,
        res,
        manager: dataSource.manager,
        redis,
      }),
    })
  );

  return app;
};

main().then((app) => {
  app.listen(PORT, () => {
    dotenv.config();

    console.log(`Server started on port http://localhost:${PORT}`);
  });
});
