import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";

const ChatBox = ({ image, name, _id, lastmessage, lastmessage_time }) => {
    const navigation = useNavigation(); // Moved inside the component

    const handleChatNavigation = () => {
        navigation.navigate('Chat', {
            name: name,
            image:image
        });
    };

    return (
        <TouchableOpacity onPress={handleChatNavigation} style={styles.container}>
            <Image source={{ uri: image }} style={styles.avatar} />
            <View style={styles.messageContainer}>
                <View style={styles.messageHeader}>
                    <Text style={styles.name}>{name}</Text>
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
        flexDirection: "row", 
        padding: 10,
        alignItems: "center", 
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0", 
        backgroundColor: "#fff", 
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
