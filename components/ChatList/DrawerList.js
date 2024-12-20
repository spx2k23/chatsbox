import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ChatList from '../../screens/ChatList';
import Users from '../../screens/Users'; // Import your other screens
import ApproveRequest from '../../screens/ApproveRequest'; // Import your other screens
import DrawerHeader from '../../components/ChatList/DrawerHeader'; // Update the import path
import { MaterialIcons } from '@expo/vector-icons';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, View,Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

const Drawer = createDrawerNavigator();

const DrawerList = () => {
const [currentUser,setCurrentUser]=useState({}); 
const db=useSQLiteContext();
  useEffect(() => {
    fetchUser();
}, []);

const fetchUser = async () => {
    const user = await db.getFirstAsync('SELECT * FROM user');
    setCurrentUser(user);
    
}
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    useEffect(() => {
    const checkSuperAdminStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token && typeof token === "string") {
        const decodedToken = jwtDecode(token);
        const superAdminStatus = decodedToken.superAdmin;
        setIsSuperAdmin(superAdminStatus);
      }
    };
    checkSuperAdminStatus();
  }, []);
  const navigation=useNavigation();
  const profileIcon = () => (
    <View>
    {currentUser.profilePicture===null&&<MaterialIcons
      name="account-circle"
      size={30}
      color="#6200EE"
      style={{ marginRight: 15 }}
      onPress={() => navigation.navigate('Profile')} // Navigate to Profile screen
    />}
   {currentUser.profilePicture!=null&&<TouchableOpacity onPress={() => navigation.navigate('Profile')} ><Image source={{ uri: `data:image/jpeg;base64,${currentUser.profilePicture}` }} style={styles.image} /></TouchableOpacity>}
    </View>
  );
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerHeader {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#fff',
          width:300,
        },
        drawerActiveBackgroundColor: '#6200EE',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#6200EE',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0, // Android shadow removal
          shadowOpacity: 0, // iOS shadow removal
        },
        headerStatusBarHeight:Platform.OS=='ios'?50:10, // Adjust if needed
        headerTintColor:'#6200EE',
        headerTitleAlign:'center',
      }}
    >
      <Drawer.Screen 
        name="ChatList" 
        component={ChatList} 
        options={{ 
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="chat" color={color} size={size} />
          ),
          title: 'Chat List',
          headerRight: profileIcon,
          headerStyle: {
            height:Platform.OS==='android'?70:110,
          },
        }}
      />
      <Drawer.Screen 
        name="Users" 
        component={Users} 
        options={{ 
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="people-outline" color={color} size={size} />
          ),
          title: 'Users',
          headerRight: profileIcon,
          headerStyle: {
            height:Platform.OS==='android'?70:110,
          },
        }}
      />
      {isSuperAdmin&&<Drawer.Screen 
        name="Approve Request"
        component={ApproveRequest} 
        options={{ 
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="check-circle-outline" color={color} size={size} />
          ),
          title: 'Approve Request',
        }}
      />}
    </Drawer.Navigator>
  );
};

const styles=StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight:Platform.OS==='ios'?30:20,
  },
});

export default DrawerList;
