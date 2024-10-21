import React, { useEffect, useState } from 'react';
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
import { setupDatabase } from './db_configs/dbSetup';
import NetInfo from '@react-native-community/netinfo';
import { gql, useMutation } from '@apollo/client';
import showLocalNotification from './components/Notification.js/ShowNotification';

const CHECK_PENDING_NOTIFICATIONS = gql`
  mutation CheckPendingNotifications {
    checkPendingNotifications {
      success
      pendingNotifications {
        type
        senderId
        receiverId
        message
      }
    }
  }
`;

const Stack = createStackNavigator();

const App = () => {

  const [checkPendingNotifications] = useMutation(CHECK_PENDING_NOTIFICATIONS);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        checkPendingNotifications()
          .then(response => {
            const { pendingNotifications } = response.data.checkPendingNotifications;

            if (pendingNotifications.length > 0) {
              pendingNotifications.forEach(notification => {
                showLocalNotification(notification.message);
                // update local db
              });
            }
          })
          .catch(error => console.error('Error checking pending notifications', error));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
