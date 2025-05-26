import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import ChatBox from "../components/ChatList/ChatBox";
import Loading from "../components/Loading/Loading";
import { useSQLiteContext } from "expo-sqlite";
import CustomDataNotFound from "../components/NotFound";
import { useFocusEffect } from "@react-navigation/native";
import { gql, useLazyQuery } from '@apollo/client';

const GET_FRIENDS = gql`
  query GetFriends {
    getFriends {
      id
      FirstName
      LastName
      Bio
      Role
      DateOfBirth
      ProfilePicture
      Email
      MobileNumber
    }
  }
`;

const ChatList = () => {

  const db = useSQLiteContext();

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessages] = useState('');

  const [getAllFriends] = useLazyQuery(GET_FRIENDS, {
    onCompleted: async (data) => {
      const friendsFromCloud = data.getFriends;

      if (!friendsFromCloud || friendsFromCloud.length === 0) {
        setMessages('Please add friends to chat');
      } else {
        for (const newUser of friendsFromCloud) {
          await db.runAsync(
            `INSERT INTO friends (userId, firstName, lastName, role, dateOfBirth, profilePicture, bio, email, phoneNumber) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(userId) DO NOTHING;`,
            [
              newUser.id,
              newUser.FirstName,
              newUser.LastName,
              newUser.Role,
              newUser.DateOfBirth,
              newUser.ProfilePicture,
              newUser.Bio,
              newUser.Email,
              newUser.MobileNumber
            ]
          );
        }

        const updatedFriends = await db.getAllAsync('SELECT * FROM friends');
        setFriends(updatedFriends);
      }
      setLoading(false);
      console.log("from cloud");
    },
    onError: (err) => {
      setMessages('Error fetching from cloud');
      setLoading(false);
      console.error(err);
    }
  });

  const fetchFriendsFromDB = async () => {
    const fetchAllFriends = await db.getAllAsync('SELECT * FROM friends');
    if (fetchAllFriends.length === 0) {
      setMessages('Fetching from cloud!');
      getAllFriends();
    } else {
      setFriends(fetchAllFriends);
      setLoading(false);
      console.log("from local");
    }
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
      <CustomDataNotFound title={message} />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.userId ? item.userId.toString() : Math.random().toString()}
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
    marginTop: 10
  },
});

export default ChatList;
