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
           headerLeft: () => (
                      <View style={styles.headertitlecontainer}>
                        <Text style={styles.appName}>SPREXCEL</Text>
                      </View>
                    ),
          headerRight:()=><NavProfileIcon currentUser={currentUser} navigation={navigation}/> , 
          
          headerStyle:{
            backgroundColor:"#6200EE",
            height:Platform.OS==='android'? 60:105,
          }

        })}
      >
        <Tab.Screen name="Home" component={ChatList} />
        <Tab.Screen name="Users" component={Users} />
        <Tab.Screen name="Announcements" component={Announcements} />
        <Tab.Screen name="Settings" component={Settings} />
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
      fontWeight:Platform.OS==='android'?600:700,
      fontSize:24,
      color:'#fff',
     
  },
});