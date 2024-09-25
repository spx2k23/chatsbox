import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ChatBox from "../components/ChatList/ChatBox";
import { useQuery, gql } from "@apollo/client";

const GET_FRIENDS = gql`
    query GetFriends {
        getFriends {
            id
            Name
            ProfilePicture
        }
    }

`
const ChatList = () => {

    const { loading, error, data} = useQuery(GET_FRIENDS);

    const renderItem = ({ item }) => (
        <ChatBox 
            name={item.Name}
            image={item.ProfilePicture}
            id={item.id}  
            lastmessage="it's secret bro!"  
            lastmessage_time="just now"
        />
    );

    if (loading) {
        return (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      }
    
      if (error) {
        return (
          <View style={styles.center}>
            <Text>Error loading friends</Text>
          </View>
        );
      }

    return (
        <View style={styles.container}>
            <FlatList
                data={data?.getFriends}
                keyExtractor={(item) => item.id}
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
