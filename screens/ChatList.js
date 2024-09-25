import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ChatBox from "../components/ChatList/ChatBox";
import { useQuery, gql } from "@apollo/client";

const GET_FRIENDS = gql`
    query GetFriends($organizationId: ID!) {
        getFriends(organizationId: $organizationId) {
            id
            Name
            ProfilePicture
        }
    }

`
const ChatList = () => {

    const [organizationId, setOrganizationId] = useState(null);

    useEffect(() => {
        const fetchOrganizationId = async () => {
          const storedOrganizationId = await AsyncStorage.getItem('organization');
          setOrganizationId(storedOrganizationId);
        };
    
        fetchOrganizationId();
      }, []);

    const { loading, error, data} = useQuery(GET_FRIENDS, {
        variables: { organizationId },
        skip: !organizationId,
    });

    const renderItem = ({ item }) => (
        <ChatBox 
            name={item.Name}
            image={item.ProfilePicture}
            id={item.id}  
            lastmessage={item.lastmessage}  
            lastmessage_time={item.lastmessage_time}  
        />
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={data.getFriends}
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
