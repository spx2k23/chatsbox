import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient';
import Login from './screens/Login';
import Register from './screens/Register';
import OrganizationReg from './screens/OrganizationReg';
import Chat from './screens/Chat';
import DrawerList from './components/ChatList/DrawerList';
import ApproveRequest from './screens/ApproveRequest';
import { StatusBar } from 'react-native';

const Stack = createStackNavigator();

const App = () => {
  const [user_id, setUserId] = useState('');

  return (
    <ApolloProvider client={client}>
      <StatusBar />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" >
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {props => <Login {...props} setUserId={setUserId} />}
          </Stack.Screen>
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          <Stack.Screen name="OrganizationReg" component={OrganizationReg} options={{ headerShown: false }} />
          <Stack.Screen name="Chats" component={DrawerList} options={{ headerShown: false }}/>
          <Stack.Screen name="Chat" >
            {props => <Chat {...props} user_id={user_id} />}
          </Stack.Screen>
          <Stack.Screen name="ApproveRequest" component={ApproveRequest} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
