import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Text, View } from 'react-native';
import ChatList from '../../screens/ChatList';
import { MaterialIcons } from '@expo/vector-icons';


const Drawer = createDrawerNavigator();

function Users() {
  return <View><Text>Users</Text></View>;
}

function Friends() {
  return <View><Text>Friends</Text></View>;
}

function ApproveRequests() {
  return <View><Text>Approve Requests</Text></View>;
}

function Logout() {
  return <View><Text>Logout</Text></View>;
}

function DrawerList() {
  return (
    <Drawer.Navigator
      drawerPosition="right"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#fff',
        },
        drawerActiveBackgroundColor:'#6200EE',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#6200EE',
      }}
    >
      <Drawer.Screen name="ChatList" component={ChatList} options={{ headerShown: true,drawerIcon:(color,size)=>{<MaterialIcons  name="person-add-alt"/>} ,title:'Users'}}/>
      <Drawer.Screen name="Friends" component={Friends} options={{ headerShown: true ,drawerIcon:(color,size)=>{<MaterialIcons  name="people-outline"/>}}}/>
      <Drawer.Screen name="ApproveRequests" component={ApproveRequests} options={{ headerShown: true,drawerIcon:(color,size)=>{<MaterialIcons  name="check-circle-outline"/>} }}/>
      <Drawer.Screen name="Logout" component={Logout} options={{ headerShown: true,drawerIcon:(color,size)=>{<MaterialIcons  name="logout"/>} }}/>
    </Drawer.Navigator>
  );
}

export default DrawerList;
