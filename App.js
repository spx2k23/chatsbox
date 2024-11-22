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
import db, { setupDatabase } from './db_configs/dbSetup';
import NetInfo from '@react-native-community/netinfo';
import { gql, useMutation } from '@apollo/client';
// import showLocalNotification from './components/Notification/ShowNotification';

const CHECK_PENDING_NOTIFICATIONS = gql`
  mutation CheckPendingNotifications {
    checkPendingNotifications {
      success
      pendingNotifications {
        type
        senderId{
          id,
          Name,
          ProfilePicture,
          Email,
          MobileNumber
        }
        receiverId
        message
      }
    }
  }
`;

const Stack = createStackNavigator();

const App = () => {

  useEffect(() => {
    setupDatabase();
  }, []);
  console.log(db);
  

  const [checkPendingNotifications] = useMutation(CHECK_PENDING_NOTIFICATIONS);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        checkPendingNotifications()
          .then(response => {
            const { pendingNotifications } = response.data.checkPendingNotifications;

            if (pendingNotifications.length > 0) {
              pendingNotifications.forEach(notification => {
                // showLocalNotification(notification.message);
                if(notification.type === 'FRIEND_REQUEST_ACCEPT') {
                  const user = notification.senderId;
                    db.runAsync(
                      `INSERT INTO friends (userId, name, profilePicture, email, phoneNumber) VALUES (?, ?, ?, ?, ?)
                      ON CONFLICT(userId) DO NOTHING;`,
                      [user.id, user.Name, user.ProfilePicture, user.Email, user.MobileNumber]
                    )
                }
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
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          <Stack.Screen name="OrganizationReg" component={OrganizationReg} options={{ headerShown: false }} />
          <Stack.Screen name="Chats" component={DrawerList} options={{ headerShown: false }}/>
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="ApproveRequest" component={ApproveRequest} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
