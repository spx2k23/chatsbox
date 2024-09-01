import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { useMutation, gql } from '@apollo/client';

const APPROVE_USER = gql`
  mutation ApproveUser($userId: ID!) {
    approveUser(userId: $userId) {
      success
      message
    }
  }
`;

const REJECT_USER = gql`
  mutation RejectUser($userId: ID!) {
    rejectUser(userId: $userId) {
      success
      message
    }
  }
`;

const RequestContainer = ({ name, email, image, userId, refetch }) => {

  const [approveUser] = useMutation(APPROVE_USER);
  const [rejectUser] = useMutation(REJECT_USER);

  const handleApprove = async (userId) => {
    const { data } = await approveUser({ variables: { userId } });
    if (data.approveUser.success) {
      refetch();
    }
  };

  const handleReject = async (userId) => {
    const { data } = await rejectUser({ variables: { userId } });
    if (data.rejectUser.success) {
      refetch();
    }
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        <View style={styles.buttonContainer}>
          <Button 
            title="Approve" 
            buttonStyle={styles.approveButton} 
            onPress={handleApprove} 
          />
          <Button 
            title="Reject" 
            buttonStyle={styles.rejectButton} 
            onPress={handleReject} 
          />
        </View>
      </View>
    </View>
  );
};

export default RequestContainer;

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
  approveButton: {
    backgroundColor: '#6200EE',
    marginRight: 10,
    width:100
  },
  rejectButton: {
    backgroundColor: '#B0BEC5',
    width:100
  },
});
