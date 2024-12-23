import { useNavigation } from "@react-navigation/native";
import { Platform, StyleSheet, Text } from "react-native";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import LogoutModal from "../components/Logout/LogoutModal";
import { useState } from "react";

const Settings=()=>{
    const navigation=useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    return(
        <View style={styles.container}>
            <TouchableOpacity   onPress={() => setModalVisible(true)}>
               <Text>Log out</Text>
            </TouchableOpacity>
            <LogoutModal
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                navigation={navigation}
      />
        </View>
    );
}

export default Settings;

const styles=StyleSheet.create({
    container:{
        marginTop:Platform.OS==='android'?20:100,
    }
});