import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient';
import Login from './screens/Login';
import Register from './screens/Register';
import OrganizationReg from './screens/OrganizationReg';
import Chat from './screens/Chat';


const Stack = createStackNavigator();

const App = () => {
  const [user_id, setUserId] = useState('');

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login"  screenOptions={{headerShown:false}}>
          <Stack.Screen name="Login"  >
            {props => <Login {...props} setUserId={setUserId} />}
          </Stack.Screen>
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="OrganizationReg" component={OrganizationReg} />
          <Stack.Screen name="Chat">
            {props => <Chat {...props} user_id={user_id} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
