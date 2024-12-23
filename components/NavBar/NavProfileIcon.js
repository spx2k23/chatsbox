import { View,TouchableOpacity,Image, StyleSheet ,Platform} from "react-native";


const NavProfileIcon = ({currentUser,navigation}) => (
    <View>
    {currentUser?.profilePicture===null&&<MaterialIcons
      name="account-circle"
      size={30}
      color="#6200EE"
      style={{ marginRight: 15 }}
      onPress={() => navigation.navigate('Profile')} // Navigate to Profile screen
    />}
   {currentUser?.profilePicture!=null&&<TouchableOpacity onPress={() => navigation.navigate('Profile')} ><Image source={{ uri: `data:image/jpeg;base64,${currentUser.profilePicture}` }} style={styles.image} /></TouchableOpacity>}
    </View>
  );

  export default NavProfileIcon;

  const styles=StyleSheet.create({
    image: {
        width: 40,
        height: 40,
        borderRadius: 25,
        marginRight:Platform.OS==='ios'?20:20,
        marginBottom:Platform.OS==='ios'?12:0,
      },
  });