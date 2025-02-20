import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View ,Text} from "react-native";
import ChatBox from "../components/ChatList/ChatBox";
import Loading from "../components/Loading/Loading";
import { useSQLiteContext } from "expo-sqlite";
import CustomDataNotFound from "../components/NotFound";
import { useFocusEffect } from "@react-navigation/native";

const ChatList = () => {

  const db = useSQLiteContext();

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFriendsFromDB = async () => {
    const fetchAllFriends = await db.getAllAsync('SELECT * FROM friends');
    setFriends(fetchAllFriends);
    setLoading(false);
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchFriendsFromDB();
    }, [])
  );

  const renderItem = ({ item }) => (
    <ChatBox
      firstName={item.firstName}
      lastName={item.lastName}
      image={item.profilePicture}
      id={item.id}
      lastmessage="it's secret bro!"
      lastmessage_time="just now"
      datas={item}
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
        <CustomDataNotFound title={'Please add friends to chat'}  />
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
    marginTop:10
  },
});

export default ChatList;
