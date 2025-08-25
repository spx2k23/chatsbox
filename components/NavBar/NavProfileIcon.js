import { View,TouchableOpacity,Image, StyleSheet ,Platform} from "react-native";
import theme from "../../config/theme";
import {s,ms} from 'react-native-size-matters';

const NavProfileIcon = ({currentUser,navigation}) => (
    <View>
    {currentUser?.profilePicture===null&&<MaterialIcons
      name="account-circle"
      size={ms(30)}
      color={theme.colors.basicColor}
      style={{ marginRight: s(15) }}
      onPress={() => navigation.navigate('Profile')} // Navigate to Profile screen
    />}
   {currentUser?.profilePicture!=null&&<TouchableOpacity onPress={() => navigation.navigate('Profile')} ><Image source={{ uri: `data:image/jpeg;base64,${currentUser.profilePicture}` }} style={styles.image} /></TouchableOpacity>}
    </View>
  );

  export default NavProfileIcon;

  const styles=StyleSheet.create({
    image: {
        width: ms(40),
        height: ms(40),
        borderRadius: ms(20),
        marginRight:ms(20),
        marginBottom:Platform.OS==='ios'?12:0,
      },
  });