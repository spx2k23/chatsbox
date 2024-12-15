import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ChatBox from "../components/ChatList/ChatBox";
import Loading from "../components/Loading/Loading";
import { useSQLiteContext } from "expo-sqlite";

const ChatList = () => {

  const db = useSQLiteContext();

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFriendsFromDB();
  }, []);

  const fetchFriendsFromDB = async () => {
    const fetchAllFriends = await db.getAllAsync('SELECT * FROM friends');
    setFriends(fetchAllFriends);
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
