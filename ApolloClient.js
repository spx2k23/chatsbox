import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { createUploadLink } from 'apollo-upload-client';

const httpLink = createUploadLink({
  uri: 'http://192.168.38.253:4000/graphql',
  // uri: 'http://192.168.5.97:4000/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const link = authLink.concat(httpLink);

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://192.168.38.253:4000/graphql',
    // url: 'ws://192.168.5.97:4000/graphql',
    connectionParams: async () => {
      const token = await AsyncStorage.getItem('token');
      return {
        authorization: token ? `Bearer ${token}` : '',
      };
    },
    // shouldRetry: true,
   
    on: {
      connected: () => console.log("WebSocket Connected"),
      closed: () => console.log("WebSocket Disconnected"),
    },
    onError: (error) => {
      console.error('WebSocket Connection Error:', error);
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  link
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
