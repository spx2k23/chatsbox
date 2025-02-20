import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "react-native";
import { Modal, TouchableWithoutFeedback, View,Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome6} from "@expo/vector-icons";
import { useState } from "react";
import AddOrgModal from "./AddOrgModal";

const SwitchOrganizationModel=({switchOrgModel,setSwitchOrgModel,addmodal,setaddmodal})=>{
        const enrolledOrgs=[
            {
                name:'WhatsApp',
                imageUrl:'https://png.pngtree.com/element_our/sm/20180626/sm_5b321c98efaa6.jpg'
            },
            {
                name:'FaceBook',
                imageUrl:'https://png.pngtree.com/png-vector/20221018/ourmid/pngtree-facebook-communication-social-media-png-image_6315969.png'
            },
            {
                name:'Instagram',
                imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj6xZwI_mfWV1TbrqxZBbr722UNyKftrsCIg&s'
            },
            {
                name:'X',
                imageUrl:'https://pngimg.com/uploads/x_logo/small/x_logo_PNG17.png'
            },
            {
                name:'Discord',
                imageUrl:null
            }
        ];
    return(
        <>
           <Modal
           animationType="fade"
           transparent={true}
           visible={switchOrgModel}
           onRequestClose={() => setSwitchOrgModel(false)} 
           >
             <TouchableWithoutFeedback onPress={() => setSwitchOrgModel(false)}>
                <View style={styles.switchModelContainer} >
                    
                    <TouchableWithoutFeedback>
                        <View style={styles.modelContentBox}>
                           <View style={styles.addOrgbox}>
                            <Text style={styles.addOrgboxText}>Organizations</Text>
                            <TouchableOpacity style={styles.addBtn} onPress={()=>{setaddmodal(true);setSwitchOrgModel(false)}}>
                                 <MaterialCommunityIcons name="plus" size={24}/>
                            </TouchableOpacity>
                           </View>
                           <ScrollView>
                            {
                                enrolledOrgs.map((org,index)=>{
                                    return <TouchableOpacity key={index} style={styles.orgBox}>
                                                {org.imageUrl?<Image source={{uri:org.imageUrl}} style={styles.orgImage}/>:<FontAwesome6 name={'globe'} size={40} color={'grey'}/>}
                                              <Text style={styles.orgText}>{org.name}</Text>
                                          </TouchableOpacity>
                                })
                            }
                           </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
           </Modal>
           
           </>
    )
}
export default SwitchOrganizationModel;

const styles=StyleSheet.create({
    switchModelContainer:{
        flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(80, 80, 80, 0.6)', 
    },
    modelContentBox:{
        backgroundColor:'white',
        width:'60%',
        height:'35%',
        padding:20,
        borderRadius:5
    },
    addOrgbox:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:10
    },
addOrgboxText:{
    fontSize:24,
    fontWeight:'500',
    color:'#6200EE'
},
addBtn:{
    alignSelf:'center',
    // marginLeft:'20%'
},
orgImage:{
    width:40,
    height:40,
    borderRadius:20,
    resizeMode: 'contain', 
   
},
orgBox:{
    flexDirection:'row',
    alignItems:'center',
    marginVertical:10
},
orgText:{
    marginLeft:20,
    fontWeight:'500'
}
})