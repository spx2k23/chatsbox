import { StyleSheet, Text } from "react-native";

const TextMessage=({currentMessage})=>{
    return(
        <Text style={styles.chat_text}>{currentMessage.text}</Text>
    );
}

export default TextMessage;

const styles=StyleSheet.create({
    chat_text:{
        color:"#fff",
        padding:5
    }
});