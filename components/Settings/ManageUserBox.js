import { View ,Image, StyleSheet, Text,TouchableOpacity} from "react-native"
import theme from "../../config/theme";
import ManageUsersModal from './ManageUsersModal';

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
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
      },
      name:{
        fontWeight:'700',
        marginBottom:3,
        fontSize:17
      },
      role:{
        color:'grey'
      },
      userRights:{
        color:theme.colors.basicColor,
        fontWeight:'500',
        position:'absolute',
        right:0,
      }
});