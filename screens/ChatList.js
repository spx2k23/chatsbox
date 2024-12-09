import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ChatBox from "../components/ChatList/ChatBox";
import { gql, useSubscription } from "@apollo/client";
import Loading from "../components/Loading/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useSQLiteContext } from "expo-sqlite";

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

  const data=[{
    name:'Drago',
    id:25,
    image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSOS1l3ChxcZAgXtI2AKpv4KliooS_mFGk3A&s',
    userId:25
  }]

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

  useSubscription(ACCEPT_FRIEND_SUBSCRIPTION, {
    variables: { receiverId: userId },
    onData: async ({ data })  => {
      if (data) {
        const { friendRequestAccept } = data.data;
        if (friendRequestAccept) {
          const user = friendRequestAccept.sender;
          const { senderId } = friendRequestAccept;
          updateUserStatus(senderId, { isRequestSent: false, isFriend: true });
          const userExist = db.getFirstAsync('SELECT * FROM friends WHERE userId = ?', [user._id]);
          if(!userExist){
            await db.runAsync('INSERT INTO friends (userId, name, profilePicture, email, phoneNumber) VALUES (?, ?, ?, ?)',
              [user._id, user.Name, user.ProfilePicture, user.Email, user.MobileNumber]
            )
          }
        }
      }
    },
  });

  const fetchFriendsFromDB = () => {
    const fetchFriends = db.getAllAsync('SELECT * FROM friends');
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
