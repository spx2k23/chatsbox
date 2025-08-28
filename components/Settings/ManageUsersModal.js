import { Modal, StyleSheet, TouchableWithoutFeedback, View,Text,Platform, TouchableOpacity } from "react-native";
import theme from "../../config/theme";
import {ms,vs} from 'react-native-size-matters';
const ManageUsersModal=({userModal,setUserModal,userId,name,userRights})=>{
    return(
        <Modal
        transparent={true}
        visible={userModal}
        onRequestClose={() => setUserModal(false)} 
        >
        <TouchableWithoutFeedback onPress={()=>setUserModal(false)}>
            <View style={styles.modaloutlayer}>
                <TouchableWithoutFeedback>
                  <View  style={styles.modalcontainer}>
                    <View style={styles.titlebox}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.userRights}>{userRights}</Text>
                    </View>
                    {userRights!=='UserAdmin'&&<TouchableOpacity><Text style={styles.btn}>Promote to User Admin</Text></TouchableOpacity>}
                    {userRights!=='SuperAdmin'&&<TouchableOpacity><Text style={styles.btn}>Promote to Super Admin</Text></TouchableOpacity>}
                    {userRights!=='AnnouncementAdmin'&&<TouchableOpacity><Text style={styles.btn}>Promote to Announcement Admin</Text></TouchableOpacity>}
                    {userRights!=='Member'&&<TouchableOpacity><Text style={styles.btn}>Demote to User</Text></TouchableOpacity>}
                    <TouchableOpacity><Text style={styles.btn}>Remove User</Text></TouchableOpacity>
                   
                  </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
        </Modal>
    );
}

export default ManageUsersModal;

const styles=StyleSheet.create({
    modaloutlayer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalcontainer:{
        backgroundColor:'white',
        width:'76%',
        padding:ms(20),
        borderRadius:10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    titlebox:{
        flexDirection:'row',
        marginBottom:5
    },
    name:{
        fontWeight:'700',
        fontSize:ms(17)
    },
    userRights:{
        color:theme.colors.basicColor,
        position:'absolute',
        right:0,
        fontWeight:'500',
        fontSize:ms(12)
    },
    btn:{
        fontWeight:'500',
        marginVertical:vs(5),
        fontSize:ms(12)
    }
})