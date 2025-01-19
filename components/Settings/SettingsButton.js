import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View,Text } from "react-native";
import { Button } from "react-native-paper";
import { Icon } from "react-native-paper";

const SettingsButton=({iconName,onPress,title,discription})=>{
    return(
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <MaterialCommunityIcons name={iconName} size={24} color={'grey'}/>
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