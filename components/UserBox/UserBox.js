import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, Modal } from "react-native";
import { gql, useMutation } from "@apollo/client";

const SEND_FRIEND_REQUEST = gql`
  mutation SendFriendRequest($senderId: ID!, $receiverId: ID!) {
    sendFriendRequest(senderId: $senderId, receiverId: $receiverId) {
      success
      message
    }
  }
`;

const UserBox = ({ image, name, email, isFriend, isRequestSent, isRequestReceived, userId, receiverId, updateUserStatus }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST);

  const handleSendRequest = async () => {
    setModalVisible(false);
    const { data } = await sendFriendRequest({
      variables: {
        senderId: userId,
        receiverId,
      },
    });
    if (data.sendFriendRequest.success) {
      updateUserStatus(receiverId, { isRequestSent: true });
    }
  };

  let buttonLabel;
  let buttonDisabled = false;

  if (isFriend) {
    buttonLabel = 'Friends';
    buttonDisabled = true;
  } else if (isRequestReceived) {
    buttonLabel = 'Friend Request Pending';
    buttonDisabled = true;
  } else if (isRequestSent) {
    buttonLabel = 'Request Send Pending';
    buttonDisabled = true;
  } else {
    buttonLabel = 'Send Friend Request';
  }

  return (
    <View>
      <TouchableOpacity
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={() => !isFriend && !isRequestSent && !isRequestReceived && setModalVisible(true)}
      >
        <View style={[styles.card, pressed ? styles.pressed : null]}>
          <Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
            <Text style={styles.UserLabel}>{buttonLabel}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={styles.modalImage} />
            <Text style={styles.modalText}>Send a request to {name}?</Text>
            <TouchableOpacity style={styles.button} onPress={handleSendRequest}>
              <Text style={styles.buttonText}>Send Request</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 1.84,
  },
  pressed: {
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  modalText: {
    marginBottom: 10,
    fontSize: 18,
    color: '#6200EE',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: '65%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#B0BEC5',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  UserLabel: {
    fontSize: 14,
  }
});

export default UserBox;
