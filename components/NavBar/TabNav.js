// import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatList from '../../screens/ChatList';
import { MaterialIcons } from '@expo/vector-icons';
import Users from '../../screens/Users';
import Settings from '../../screens/Settings';
import Announcements from '../../screens/Announcements';
import { Platform } from 'react-native';
import { View,Text,StyleSheet} from 'react-native';
import NavProfileIcon from './NavProfileIcon';
import { useState,useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSQLiteContext } from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';



const Tab = createBottomTabNavigator();

const TabNav=()=>{

  const navigation=useNavigation();
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
   
    return(
     
            <Tab.Navigator
            
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Users') {
              iconName = 'group';
            }else if (route.name === 'Announcements') {
                iconName = 'campaign';
              }
            else iconName='settings'
            return <MaterialIcons  name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#6200EE",
          tabBarInactiveTintColor: 'gray',
          headerTitle:'',
          tabBarLabelStyle: {
            fontSize: 12,
                     },
          tabBarStyle: {
            paddingBottom: 8,  // Add padding to the bottom of the tab bar
            height:Platform.OS==='android'?60:70,  // Optional: Adjust the height of the tab bar
                    },
          headerRight:()=><NavProfileIcon currentUser={currentUser} navigation={navigation}/> , 
          
          headerStyle:{
            height:Platform.OS==='android'? 60:105,
          }

        })}
      >
        <Tab.Screen name="Home" component={ChatList}
        options={()=>({
          headerLeft: () => (
            <View style={styles.headertitlecontainer}>
              <Text style={styles.appName}>SPREXCEL</Text>
            </View>
          ),
        })}
         />
        <Tab.Screen name="Users" component={Users} 
         options={()=>({
          headerLeft: () => (
            <View style={styles.headertitlecontainer}>
              <Text style={styles.navHeader}>Users</Text>
            </View>
          ),
        })}
        />
        <Tab.Screen name="Announcements" component={Announcements}
         options={()=>({
          headerLeft: () => (
            <View style={styles.headertitlecontainer}>
              <Text style={styles.navHeader}>Announcements</Text>
            </View>
          ),
        })}
         />
        <Tab.Screen name="Settings" component={Settings} 
         options={()=>({
          headerLeft: () => (
            <View style={styles.headertitlecontainer}>
              <Text style={styles.navHeader}>Settings</Text>
            </View>
          ),
        })}
        />
      </Tab.Navigator>
 
    );
}

export default TabNav;

const styles=StyleSheet.create({
  headertitlecontainer:{
    alignItems:'center',
    marginLeft:20
  },
  appName:{
      marginLeft:10,
      letterSpacing:5,
      fontWeight:600,
      fontSize:24,
       color:"#6200EE",
       width:'100%'
  },
  navHeader:{
    marginLeft:10,
      letterSpacing:2,
      fontWeight:500,
      fontSize:22,
       color:"#6200EE",
       width:'100%'
  }
});