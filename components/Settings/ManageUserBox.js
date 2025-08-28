import { View ,Image, StyleSheet, Text,TouchableOpacity} from "react-native"
import theme from "../../config/theme";
import ManageUsersModal from './ManageUsersModal';
import {s,ms,vs} from 'react-native-size-matters';
const ManageUserBox=({firstName, lastName,role,image,userId,userRights,setUserModal,userModal})=>{
    return(<TouchableOpacity style={styles.container} onPress={()=>setUserModal(true)} >
         <ManageUsersModal userModal={userModal} setUserModal={setUserModal} userId={userId} name={firstName+" "+lastName} userRights={userRights}/>
                <Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={styles.image} />
                <View>
                    <Text style={styles.name}>{firstName+" "+lastName}</Text>
                    <Text style={styles.role}>{role}</Text>
                </View>
                <Text style={styles.userRights}>{userRights}</Text>
         </TouchableOpacity>);
}

export default ManageUserBox;

const styles=StyleSheet.create({
    container:{
    marginHorizontal:20,
    marginVertical:15,
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:"#fff"
    },
    image: {
        width: ms(40,.4),
        height: ms(40,.4),
        borderRadius: ms(20,.4),
        marginRight: 10,
        marginLeft:ms(10)
      },
      name:{
        fontWeight:'700',
        marginBottom:3,
        fontSize:ms(17,.4)
      },
      role:{
        color:'grey',
        fontSize:ms(14,.4)
      },
      userRights:{
        color:theme.colors.basicColor,
        fontWeight:'500',
        position:'absolute',
        right:ms(10),
        fontSize:ms(12)
      }
});