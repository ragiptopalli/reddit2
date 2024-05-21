'use client';

import React from 'react';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  connectToDevTools: true,
  credentials: 'include',
});

type P = {
  readonly children?: React.ReactNode;
};

const GraphqlProvider = ({ children }: P) => (
  <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
);

export { GraphqlProvider };
