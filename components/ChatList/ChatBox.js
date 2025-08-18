import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Image, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";

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
        padding: 10,
        alignItems: "center", 
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0", 
        backgroundColor: "#fff", 
        width:Platform.OS==='ios'?410:390,
        alignSelf:'center',
        borderRadius:10
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25, 
        marginRight: 10,
    },
    messageContainer: {
        flex: 1, 
        justifyContent: "center",
    },
    messageHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5, 
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
    },
    time: {
        fontSize: 12,
        color: "#757575", 
    },
    lastMessage: {
        fontSize: 14,
        color: "#616161", 
    },
});

export default ChatBox;
