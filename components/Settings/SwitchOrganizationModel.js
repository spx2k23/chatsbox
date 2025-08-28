import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "react-native";
import { Modal, TouchableWithoutFeedback, View,Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome6} from "@expo/vector-icons";
import { useState } from "react";
import AddOrgModal from "./AddOrgModal";
import theme from "../../config/theme";
import {ms,s,vs} from 'react-native-size-matters';
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
                                 <MaterialCommunityIcons name="plus" size={ms(22)}/>
                            </TouchableOpacity>
                           </View>
                           <ScrollView>
                            {
                                enrolledOrgs.map((org,index)=>{
                                    return <TouchableOpacity key={index} style={styles.orgBox}>
                                                {org.imageUrl?<Image source={{uri:org.imageUrl}} style={styles.orgImage}/>:<FontAwesome6 name={'globe'} size={ms(30)} color={'grey'} style={styles.orgImage}/>}
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
        paddingLeft:s(15),
        paddingRight:ms(6),
        paddingVertical:vs(8),
        borderRadius:5
    },
    addOrgbox:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:10
    },
addOrgboxText:{
    fontSize:ms(20),
    fontWeight:'500',
    color:theme.colors.basicColor
},
addBtn:{
    alignSelf:'center',
    // marginLeft:'20%'
},
orgImage:{
    width:ms(30),
    height:ms(30),
    borderRadius:ms(15),
    resizeMode: 'contain', 
   
},
orgBox:{
    flexDirection:'row',
    alignItems:'center',
    marginVertical:10
},
orgText:{
    marginLeft:20,
    fontWeight:'500',
    fontSize:ms(14)
}
})