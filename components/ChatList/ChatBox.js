import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Image, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import {s,ms,vs} from 'react-native-size-matters';

const ChatBox = ({ image, firstName, lastName, id, lastmessage, lastmessage_time ,datas}) => {
    const navigation = useNavigation(); // Moved inside the component

    const handleChatNavigation = () => {
        
        navigation.navigate('Chat', {
            name: firstName+lastName,
            image:image,
            datas:datas
        });
    
    };

    return (
        <TouchableOpacity onPress={handleChatNavigation} style={styles.container}>
            <Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={styles.avatar} />
            <View style={styles.messageContainer}>
                <View style={styles.messageHeader}>
                    <Text style={styles.name}>{firstName} {lastName}</Text>
                    <Text style={styles.time}>{lastmessage_time}</Text>
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {lastmessage}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        margin:2,
        flexDirection: "row", 
        padding: ms(10),
        alignItems: "center", 
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0", 
        backgroundColor: "#fff", 
        width:s(335),
        alignSelf:'center',
        borderRadius:s(10)
    },
    avatar: {
        width: ms(50),
        height: ms(50),
        borderRadius: s(25), 
        marginRight: s(10),
    },
    messageContainer: {
        flex: 1, 
        justifyContent: "center",
    },
    messageHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: vs(5), 
    },
    name: {
        fontSize: ms(14),
        fontWeight: "bold",
    },
    time: {
        fontSize: ms(10),
        color: "#757575", 
    },
    lastMessage: {
        fontSize: ms(12),
        color: "#616161", 
    },
});

export default ChatBox;
