import React, { useEffect, useState } from 'react';
import { NavigationContainer, } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ApolloProvider } from '@apollo/client';
import { StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

import client from './ApolloClient';
import { initializeDatabase } from './db_configs/dbSetup';
import Login from './screens/Login';
import Register from './screens/Register';
import OrganizationReg from './screens/OrganizationReg';
import Chat from './screens/Chat';
import DrawerList from './components/ChatList/DrawerList';
import ApproveRequest from './screens/ApproveRequest';
import Profile from './screens/Profile';
import NotificationListener from './components/Notification/NotificationListener';
import NetworkListener from './components/Notification/NetworkListener';

const Stack = createStackNavigator();

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking token:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <SQLiteProvider databaseName='chat.db' onInit={initializeDatabase} >
      <ApolloProvider client={client}>
        <StatusBar />
        <NavigationContainer>
          {isAuthenticated ? (
            <Stack.Navigator initialRouteName="Chats" >
              <Stack.Screen name="Chats" component={DrawerList} options={{ headerShown: false }} />
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
          ) : (
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
              <Stack.Screen name="OrganizationReg" component={OrganizationReg} options={{ headerShown: false }} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
        {isAuthenticated && (
          <>
            <NotificationListener />
            <NetworkListener />
          </>
        )}
      </ApolloProvider>
    </SQLiteProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  backIconContainer: {
    paddingLeft: 10,
  }
});
