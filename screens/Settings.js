import { useNavigation } from "@react-navigation/native";
import { Platform, StyleSheet, Text } from "react-native";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import LogoutModal from "../components/Logout/LogoutModal";
import { useState } from "react";
import SettingsButton from "../components/Settings/SettingsButton";

const Settings=()=>{
    const navigation=useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    return(
        <View style={styles.container}>
            <SettingsButton title={'Organization Code'} discription={'Organizations Code'} iconName={'office-building-cog-outline'} onPress={()=>navigation.navigate('OrganizationCode')}/>
            <SettingsButton title={'Approve Requests'} discription={'Approve Members'} iconName={'send-check-outline'} onPress={()=>console.log('pressed !')}/>
            <SettingsButton title={'Help'} discription={'Report Problem, Help Desk'} iconName={'help-circle-outline'} onPress={()=>console.log('pressed !')}/>        
            {/* <TouchableOpacity   onPress={() => setModalVisible(true)}>
               <Text>Log out</Text>
            </TouchableOpacity> */}
            <LogoutModal isVisible={modalVisible} onClose={() => setModalVisible(false)} navigation={navigation}/>
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
});