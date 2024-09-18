import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ChatBox from "../components/ChatList/ChatBox";

const ChatList = () => {
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    const data = [
        {
            name: 'drago1',
            Image: 'https://cdn.pixabay.com/photo/2023/01/06/12/38/ai-generated-7701143_960_720.jpg',
            _id: 'kdnv58',
            lastmessage: "hi",
            lastmessage_time: '1:45pm'
        },
        {
            name: 'drago2',
            Image: 'https://cdn.pixabay.com/photo/2023/01/06/12/38/ai-generated-7701143_960_720.jpg',
            _id: 'kdnv555',
            lastmessage: "hi",
            lastmessage_time: '1:45pm'
        },
        {
            name: 'drago3',
            Image: 'https://cdn.pixabay.com/photo/2023/01/06/12/38/ai-generated-7701143_960_720.jpg',
            _id: 'kdnv5825',
            lastmessage: "hi",
            lastmessage_time: '1:45pm'
        },
    ];

    const renderItem = ({ item }) => (
        <ChatBox 
            name={item.name}
            image={item.Image}
            _id={item._id}  
            lastmessage={item.lastmessage}  
            lastmessage_time={item.lastmessage_time}  
        />
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', 
    },
});

export default ChatList;
