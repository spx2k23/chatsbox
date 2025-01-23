import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ApolloProvider } from '@apollo/client';
import { StatusBar, StyleSheet, TouchableOpacity, BackHandler, Text } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import client from './ApolloClient';
import Login from './screens/Login';
import Register from './screens/Register';
import OrganizationReg from './screens/OrganizationReg';
import Chat from './screens/Chat';
import Profile from './screens/Profile';
import { initializeDatabase } from './db_configs/dbSetup';
import NotificationListener from './components/Notification/NotificationListener';
import NetworkListener from './components/Notification/NetworkListener';
import TabNav from './components/NavBar/TabNav';
import SettingsOrgCode from './screens/SettingsOrgCode';
import { View } from 'react-native';

const Stack = createStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Track auth status
  // Check for token validity on app startup
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking token:", error);
        setIsAuthenticated(false);
      }
    };

    checkToken();
  }, []);

  // Don't render anything until we check the token
  if (isAuthenticated === null) {
    return null; // Or show a loading spinner
  }

  return (
    <SQLiteProvider databaseName='chat.db' onInit={initializeDatabase}>
      <ApolloProvider client={client}>
        <StatusBar />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={isAuthenticated ? "Chats" : "Login"}
            screenOptions={{
              gestureEnabled: false, // Disable swipe back gestures globally
            }}
          >
            {/* Login screen */}
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />

            {/* Register screen */}
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />

            {/* Organization Registration screen */}
            <Stack.Screen
              name="OrganizationReg"
              component={OrganizationReg}
              options={{ headerShown: false }}
            />

            {/* Chats screen */}
            <Stack.Screen
              name="Chats"
              component={TabNav}
              options={{
                headerShown: false,  // No header on Chats screen
                gestureEnabled: false, // Disable swipe gestures on Chats screen
              }}
            />

            {/* Chat screen */}
            <Stack.Screen
              name="Chat"
              component={Chat}
              options={{ headerShown: true }}
            />

            {/* Profile screen */}
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={({ navigation }) => ({
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconContainer}>
                    <MaterialIcons name="arrow-back" size={24} color="#6200EE" />
                  </TouchableOpacity>
                ),
                headerTitle: '',  // Hide the title
                headerShown: true,
              })}
            />
            <Stack.Screen
              name="OrganizationCode"
              component={SettingsOrgCode}
              options={({ navigation }) => ({
                headerLeft: () => (
                  <View style={styles.titleContainer}>
                  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconContainer}>
                    <MaterialIcons name="arrow-back" size={24} />
                  </TouchableOpacity>
                  <Text style={styles.title}> Organization Code</Text>
                  </View>
                ),
                headerShown: true,
                headerTitle:'',
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
        {isAuthenticated && (
          <>
            <NotificationListener />
            {/* <NetworkListener /> */}
          </>
        )}
      </ApolloProvider>
    </SQLiteProvider>
  );
};

const styles = StyleSheet.create({
  backIconContainer: {
    paddingLeft: 10,
  },
  titleContainer:{
    flexDirection:'row',
  },
  title:{
    fontSize:24,
    fontWeight:500,
    width:'100%',
    marginLeft:10
  }
});

export default App;
