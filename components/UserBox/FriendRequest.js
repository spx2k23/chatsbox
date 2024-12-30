import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { gql, useMutation } from "@apollo/client";
import { useSQLiteContext } from 'expo-sqlite';

const ACCEPT_FRIEND_REQUEST = gql`
  mutation AcceptFriendRequest($senderId: ID!, $receiverId: ID!) {
    acceptFriendRequest(senderId: $senderId, receiverId: $receiverId) {
      success
      message
      receiver {
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
  }
`;

const REJECT_FRIEND_REQUEST = gql`
  mutation RejectFriendRequest($senderId: ID!, $receiverId: ID!) {
    rejectFriendRequest(senderId: $senderId, receiverId: $receiverId) {
      success
      message
    }
  }
`;

const FriendRequest = ({ firstName, lastName, email, image, userId, receiverId, isRequestSent, isRequestReceived, updateUserStatus }) => {

  const db = useSQLiteContext();

  const [acceptFriendRequest] = useMutation(ACCEPT_FRIEND_REQUEST);
  const [rejectFriendRequest] = useMutation(REJECT_FRIEND_REQUEST);

  const handleAccept = async (userId) => {
    const { data } = await acceptFriendRequest({
      variables: {
        senderId: userId,
        receiverId,
      }
    });
    if (data.acceptFriendRequest.success) {
      const user = data.acceptFriendRequest.receiver
      updateUserStatus(receiverId, { isRequestReceived: false, isFriend: true });
      
      const result = await db.runAsync(
        `INSERT INTO friends (userId, firstName, lastName, role, dateOfBirth, profilePicture, bio, email, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(userId) DO NOTHING;`,
        [user.id, user.FirstName, user.LastName, user.Role, user.DateOfBirth, user.ProfilePicture, user.Bio, user.Email, user.MobileNumber]
      )
    }
  };

  const handleReject = async (userId) => {
    const { data } = await rejectFriendRequest({
      variables: {
        senderId: userId,
        receiverId,
      }
    });
    if (data.rejectFriendRequest.success) {
      updateUserStatus(receiverId, { isRequestReceived: false });
    }
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{firstName} {lastName}</Text>
        <Text style={styles.email}>{email}</Text>
        <View>
          {
            isRequestReceived && (
              <View style={styles.buttonContainer}>
                <Button
                  title="Accept"
                  buttonStyle={styles.acceptButton}
                  onPress={() => handleAccept(userId)}
                />
                <Button
                  title="Reject"
                  buttonStyle={styles.rejectButton}
                  onPress={() => handleReject(userId)}
                />
              </View>

            )
          }
          {
            isRequestSent && (
              <View>
                <Text>send friend request</Text>
              </View>
            )
          }
        </View>
      </View>
    </View>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#6200EE',
    marginRight: 10,
    width: 100
  },
  rejectButton: {
    backgroundColor: '#B0BEC5',
    width: 100
  },
});
