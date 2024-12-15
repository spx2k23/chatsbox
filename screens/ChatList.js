import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ChatBox from "../components/ChatList/ChatBox";
import Loading from "../components/Loading/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useSQLiteContext } from "expo-sqlite";

const ChatList = () => {

  const db = useSQLiteContext();

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    
    fetchFriendsFromDB();
    const fetchOrgAndUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
      } catch (error) {
        console.error('Error fetching organization or user:', error);
      }
    };
    fetchOrgAndUser();
  }, []);

  const fetchFriendsFromDB = () => {
    const fetchFriends = db.getAllAsync('SELECT * FROM friends');
    console.log(fetchFriends);
    setFriends(fetchFriends);
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <ChatBox
      name={item.name}
      image={item.profilePicture}
      id={item.id}
      lastmessage="it's secret bro!"
      lastmessage_time="just now"
    />
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    );
  }

  if (friends.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No friends found</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.userId.toString()}
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
