import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ChatBox from "../components/ChatList/ChatBox";
import { gql, useSubscription } from "@apollo/client";
import db from "../db_configs/dbSetup";

const ACCEPT_FRIEND_SUBSCRIPTION = gql`
  subscription FriendRequestAccept($receiverId: ID!) {
    friendRequestAccept(receiverId: $receiverId) {
      senderId
      receiverId
      sender
    }
  }
`;

const ChatList = () => {

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFriendsFromDB();
  }, []);

  useSubscription(ACCEPT_FRIEND_SUBSCRIPTION, {
    variables: { receiverId: userId },
    onData: ({ data }) => {
      if (data) {
        const { friendRequestAccept } = data.data;
        if (friendRequestAccept) {
          const user = friendRequestAccept.sender;
          const { senderId } = friendRequestAccept;
          updateUserStatus(senderId, { isRequestSent: false, isFriend: true });
          db.transaction(tx => {
            tx.executeSql(
              `INSERT INTO friends (userId, name, profilePicture, email, phoneNumber) VALUES (?, ?, ?, ?);`,
              [user._id, user.Name, user.ProfilePicture, user.Email, user.MobileNumber],
              () => console.log('Friend added successfully to local database'),
              (txObj, error) => console.error('Error adding friend to database', error)
            );
          });
        }
      }
    },
  });

  const fetchFriendsFromDB = () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM friends;`,
        [],
        (txObj, { rows: { _array } }) => {
          setFriends(_array);
          setLoading(false);
        },
        (txObj, error) => {
          console.error('Error fetching friends from SQLite', error);
          setLoading(false);
        }
      );
    });
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
        <ActivityIndicator size="large" color="#0000ff" />
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
