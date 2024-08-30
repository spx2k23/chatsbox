import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Text, View ,StyleSheet} from 'react-native';
import ChatList from '../../screens/ChatList';
import { MaterialIcons } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

function Users() {
  return (
    <View>
      <Text>Users</Text>
    </View>
  );
}

function Friends() {
  return (
    <View>
      <Text>Friends</Text>
    </View>
  );
}

function ApproveRequests() {
  return (
    <View>
      <Text>Approve Requests</Text>
    </View>
  );
}

function Logout() {
  return (
    <View>
      <Text>Logout</Text>
    </View>
  );
}

function CustomDrawerContent(props) {
  return (
    <View style={styles.container}>
      <View style={styles.drawerbox} > 
        <Text style={styles.heading}>Welcome</Text>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </View>
    </View>
  );
}

const styles=StyleSheet.create({
container:{
  flex:1
},
drawerbox:{
  marginTop:70,
  height:'100%'
},
heading:{
  color:'#6200EE',
  textAlign:'center',
  fontWeight:'500',
  fontSize:20,
}
});

function DrawerList() {
  return (
    <Drawer.Navigator
      drawerPosition="right"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#fff',
        },
        drawerActiveBackgroundColor: '#6200EE',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#6200EE',
        headerTintColor: '#6200EE',
        headerTitleAlign:'center'
      }}
    >
      <Drawer.Screen 
        name="ChatList" 
        component={ChatList} 
        options={{ 
          headerShown: true,
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="person-add-alt" color={color} size={size} />
          ),
          title: 'Users',
        }}
      />
      <Drawer.Screen 
        name="Friends" 
        component={Friends} 
        options={{ 
          headerShown: true,
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="people-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen 
        name="ApproveRequests" 
        component={ApproveRequests} 
        options={{ 
          headerShown: true,
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="check-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Logout" 
        component={Logout} 
        options={{ 
          headerShown: true,
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="logout" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerList;
