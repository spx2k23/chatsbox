import {  TouchableOpacity, View,Image,Text} from "react-native";
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
const GroupInfo=()=>{
    const route = useRoute();
  const { data } = route.params;
  const navigation = useNavigation();
    return(
        <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={24} />
            </TouchableOpacity>
            <View style={styles.profileContainer}>
            <Image
                // source={{ uri: `data:image/jpeg;base64,${data.image}` }}
                source={{uri:data.image}}
                style={styles.profileImg}
              />
              <Text style={styles.profileName}>{data.name}</Text>
            </View>
        </View>
    );
}
export default GroupInfo;

const styles=StyleSheet.create({
    container:{
        flex:1,
        paddingTop:25
    },
    profileContainer:{
        alignItems:'center'
    },
    profileImg: {
        width: 65,
        height: 65,
        borderRadius: 32,
        marginHorizontal: 10,
      },
      profileName:{
        fontWeight:600,
        fontSize:24
      }
});