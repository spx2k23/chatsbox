import React, { useEffect, useState } from 'react';
import { NavigationContainer, } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ApolloProvider } from '@apollo/client';
import { StatusBar,StyleSheet,TouchableOpacity } from 'react-native';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { MaterialIcons } from '@expo/vector-icons';
// import { gql, useMutation } from '@apollo/client';
// import NetInfo from '@react-native-community/netinfo';

import client from './ApolloClient';
import Login from './screens/Login';
import Register from './screens/Register';
import OrganizationReg from './screens/OrganizationReg';
import Chat from './screens/Chat';
import DrawerList from './components/ChatList/DrawerList';
import ApproveRequest from './screens/ApproveRequest';
import { initializeDatabase } from './db_configs/dbSetup';
import Profile from './screens/Profile';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { jwtDecode } from 'jwt-decode';
// import showLocalNotification from './components/Notification/ShowNotification';

// const CHECK_PENDING_NOTIFICATIONS = gql`
//   mutation CheckPendingNotifications {
//     checkPendingNotifications {
//       success
//       pendingNotifications {
//         type
//         senderId{
//           id,
//           Name,
//           ProfilePicture,
//           Email,
//           MobileNumber
//         }
//         receiverId
//         message
//       }
//     }
//   }
// `;

const Stack = createStackNavigator();

const App = () => {

  // const [checkPendingNotifications] = useMutation(CHECK_PENDING_NOTIFICATIONS);

  // const isTokenExpired = (token) => {
  //   try {
  //     const decoded = jwtDecode(token);
  //     const currentTime = Math.floor(Date.now() / 1000);
  //     return decoded.exp < currentTime;
  //   } catch (error) {
  //     console.error('Error decoding token:', error);
  //     return true;
  //   }
  // };

  // useEffect(() => {
  //   const initialize = async () => {
  //     const token = await AsyncStorage.getItem('token');
  //     if (token && !isTokenExpired(token)) {
  //       const unsubscribe = NetInfo.addEventListener(state => {
  //         if (state.isConnected) {
  //           checkPendingNotifications()
  //             .then(response => {
  //               const { pendingNotifications } = response.data.checkPendingNotifications;
  //               if (pendingNotifications.length > 0) {
  //                 pendingNotifications.forEach(notification => {
  //                   // Handle friend requests or other notifications
  //                 });
  //               }
  //             })
  //             .catch(error => console.error('Error checking pending notifications', error));
  //         }
  //       });
  //       return () => {
  //         unsubscribe();
  //       };
  //     }
  //   };
  
  //   initialize();
  // }, []);

  return (
    <SQLiteProvider databaseName='chat.db' onInit={initializeDatabase} >
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
            <Stack.Screen name="Profile" component={Profile} options={({ navigation }) => ({
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconContainer}>
                    <MaterialIcons name="arrow-back" size={24} color="#6200EE" />
                  </TouchableOpacity>
                ),
                headerTitle: '',  // Hide the title
                headerShown: true, // Ensure header is shown
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    </SQLiteProvider>
  );
};

export default App;

const styles=StyleSheet.create({
backIconContainer:{
  paddingLeft: 10,
}
});