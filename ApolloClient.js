import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';

const httpLink = createHttpLink({
  uri: 'http://192.168.96.253:5000/graphql',
  // uri: 'http://192.168.100.4:5000/graphql',
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

const wsLink = new WebSocketLink({
  uri: 'ws://192.168.96.253:5000/graphql',
  // uri: 'ws://192.168.100.4:5000/graphql',
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  link,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
