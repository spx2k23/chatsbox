import { useNavigation } from "@react-navigation/native";
import { Image, Dimensions, StyleSheet, Text } from "react-native";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import LogoutModal from "../components/Logout/LogoutModal";
import { useState } from "react";
import SettingsButton from "../components/Settings/SettingsButton";
import { FontAwesome6} from "@expo/vector-icons";
import SwitchOrganizationModel from "../components/Settings/SwitchOrganizationModel";
import AddOrgModal from "../components/Settings/AddOrgModal";


const { width } = Dimensions.get('window');
const scale = width / 375;
const scaleSize = (size) => size * scale;

const Settings=()=>{
    const navigation=useNavigation();
    const [logoutmodalVisible, setlogoutModalVisible] = useState(false);
    const [switchOrgModel,setSwitchOrgModel]=useState(false);
    const [addmodal,setaddmodal]=useState(false);   
    
    const organization={
        imgUrl:null,
        name:'Sprexcel'
    }
    return(
        <View style={styles.container}>
            <TouchableOpacity style={styles.orgswitchContainer} onPress={() => setSwitchOrgModel(true)}>
               {organization.imgUrl?<Image source={{ uri: `data:image/jpeg;base64,${organization.imgUrl}`}} style={styles.orgImg} />:
               <FontAwesome6 name={'globe'} size={24} color={'grey'}/>}
                <View style={styles.textbox}>
                <Text style={styles.title}>{organization.name}</Text>
                <Text style={styles.discription}>Switch Organization</Text>
                </View>
                <FontAwesome6 name="angle-down" size={20} color="grey" />
            </TouchableOpacity>
            {switchOrgModel&&<SwitchOrganizationModel setSwitchOrgModel={setSwitchOrgModel} switchOrgModel={switchOrgModel} addmodal={addmodal} setaddmodal={setaddmodal}/>}
            {addmodal&&<AddOrgModal addmodal={addmodal} setaddmodal={setaddmodal}/>}
            <SettingsButton title={'Organization Code'} discription={'Change Organizations Code'} iconName={'office-building-cog-outline'} onPress={()=>navigation.navigate('OrganizationCode')}/>
            <SettingsButton title={'Manage Users'} discription={'Promote,Depromote or Remove users'} iconName={'account-cog-outline'} onPress={()=>navigation.navigate('ManageUsers')}/>    
            <SettingsButton title={'Approve Requests'} discription={'Approve Members'} iconName={'send-check-outline'} onPress={()=>console.log('pressed !')}/>
            <SettingsButton title={'Help'} discription={'Report Problem, Help Desk'} iconName={'help-circle-outline'} onPress={()=>console.log('pressed !')}/> 
            <SettingsButton title={'Logout'} discription={'Logout Now'} iconName={'logout'} onPress={()=>setlogoutModalVisible(true)}/>           
            <LogoutModal isVisible={logoutmodalVisible} onClose={() => setlogoutModalVisible(false)} navigation={navigation}/>
                <TouchableOpacity onPress={()=>navigation.navigate('GroupChat')}>
                    <Text>Check Group UI</Text>
                </TouchableOpacity>
        </View>
    );
}

export default Settings;

const styles=StyleSheet.create({
    container:{
       padding:20,
       flex:1,
       backgroundColor:'#fff'
    },
    orgImg:{
        width: 50,
        height: 50,
        borderRadius: 30,
    },
    orgswitchContainer:{
        flexDirection:'row',
        alignItems:'center'
    },
    title:{
        fontSize:20,
        fontWeight:500
    },
    discription:{
        color:'grey'
    },
    textbox:{
        marginHorizontal:22
    },
});