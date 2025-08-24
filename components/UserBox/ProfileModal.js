import React, { useState } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform, TouchableWithoutFeedback } from "react-native";
import { gql, useMutation } from "@apollo/client";
import theme from "../../config/theme";
import {s} from 'react-native-size-matters';

const SEND_FRIEND_REQUEST = gql`
  mutation SendFriendRequest($friendRequestSenderId: ID!, $friendRequestReceiverId: ID!) {
    sendFriendRequest(friendRequestSenderId: $friendRequestSenderId, friendRequestReceiverId: $friendRequestReceiverId) {
      success
      message
    }
  }
`;

const ProfileModal = ({ setModalVisible, image, firstName, lastName, email, role, bio, modalVisible, userId, receiverId, updateUserStatus, isFriend }) => {
  const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST);

  const [loading, setLoading] = useState(false);

  const handleSendRequest = async () => {
    setLoading(true);
    const { data } = await sendFriendRequest({
      variables: { friendRequestSenderId: userId, friendRequestReceiverId: receiverId },
    });
    
    if (data.sendFriendRequest.success) {
      setModalVisible(false);
      setLoading(false);
      updateUserStatus(receiverId, { isRequestSent: true });
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)} 
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={styles.modalImage} />
              <Text style={styles.nameText}>{firstName} {lastName}</Text>
              <Text style={styles.emailText}>{email}</Text>
              <Text style={styles.roleText}>{role===null?'Role Not Found':role}</Text>
              <Text style={styles.bioText}>{bio === null ? "This person has not set bio" : bio}</Text>

              { !isFriend && (
                <View>
                  <Text style={styles.modalText}>Send a request to {firstName} {lastName}?</Text>
                  {/* Buttons on Same Line */}
                  <View>
                    {
                      loading === true ? <Text style={styles.bioText}>sending...</Text> :
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleSendRequest}>
                          <Text style={styles.buttonText}>Send Request</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                          <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    }
                  </View>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
  },
  modalContent: {
    width: s(300),  
    padding: s(20),
    backgroundColor: 'white',
    borderRadius: s(10),
    alignItems: 'center',
  },
  modalImage: {
    width: s(80),
    height: s(80),
    borderRadius: s(40),
    marginBottom: s(20),
  },
  nameText: {
    fontSize: s(20), 
    fontWeight: 'bold',
    color: '#1E1E1E',  
    marginBottom: s(5),
  },
  emailText: {
    fontSize: s(14),
    color: '#6B6B6B',  
    marginBottom: s(10),  
  },
  bioText: {
    fontSize: s(11),
    color: '#8C8C8C',  
    fontStyle: 'italic',
    marginBottom: s(10),
    textAlign: 'center',
  },
  roleText: {
    fontSize: s(14),
    color: '#3F51B5', 
    marginBottom: s(13),
    fontWeight: '600',
  },
  modalText: {
    marginTop: s(13),
    marginBottom: s(8), 
    fontSize: s(14),
    color: theme.colors.basicColor,  
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
  },
  button: {
    backgroundColor:theme.colors.basicColor, 
    padding: s(9),
    borderRadius: s(4),
    width: '45%', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#B0BEC5', 
  },
  buttonText: {
    color: 'white',
    fontSize: s(12),
    fontWeight: 'bold',
  },
});

export default ProfileModal;
