"use client";
// ^ this file needs the "use client" pragma

import { HttpLink, split, ApolloLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";

// have a function to create a client for you
function makeClient() {
  const httpLink = new HttpLink({
    credentials: "include",
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
    fetchOptions: { cache: "no-store" },
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: process.env.NEXT_PUBLIC_GRAPHQL_WS_URI!,
      connectionParams: {
        credentials: "include",
      },
    })
  );

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink as unknown as ApolloLink,
    httpLink
  );

  // use the `ApolloClient` from "@apollo/experimental-nextjs-app-support"
  return new ApolloClient({
    // use the `InMemoryCache` from "@apollo/experimental-nextjs-app-support"
    cache: new InMemoryCache(),
    link: splitLink,
    defaultOptions: {
      // Use caching strategy that works better with SSR and hydration
      watchQuery: {
        fetchPolicy: "cache-first",
        errorPolicy: "all",
      },
      query: {
        fetchPolicy: "cache-first",
        errorPolicy: "all",
      },
    },
  });
}

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
