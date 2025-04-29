import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View,Text } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

const SettingsButton=({iconName,onPress,title,discription,isMaterialCommunity})=>{
    return(
        <TouchableOpacity onPress={onPress} style={styles.container}>
           {isMaterialCommunity&& <MaterialCommunityIcons name={iconName} size={24} color={'grey'}/>}
           {!isMaterialCommunity&&<AntDesign name={iconName} size={24} color="grey" />}
            <View style={styles.textbox}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.discription}>{discription}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default SettingsButton;

const styles=StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:15
    },
    textbox:{
        marginLeft:22
    },
    title:{
        fontSize:20,
        fontWeight:500
    },
    discription:{
        color:'grey'
    }
});