import React, { useState } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform, TouchableWithoutFeedback } from "react-native";
import { gql, useMutation } from "@apollo/client";

const SEND_FRIEND_REQUEST = gql`
  mutation SendFriendRequest($senderId: ID!, $receiverId: ID!) {
    sendFriendRequest(senderId: $senderId, receiverId: $receiverId) {
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
      variables: { senderId: userId, receiverId },
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
              <Text style={styles.roleText}>{role}</Text>
              <Text style={styles.bioText}>{bio === null ? "This guy has not set bio hahaa..." : bio}</Text>

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
    width: 320,  
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
  nameText: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#1E1E1E',  
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    color: '#6B6B6B',  
    marginBottom: 12,  
  },
  bioText: {
    fontSize: 14,
    color: '#8C8C8C',  
    fontStyle: 'italic',
    marginBottom: 12,
    textAlign: 'center',
  },
  roleText: {
    fontSize: 16,
    color: '#3F51B5', 
    marginBottom: 15,
    fontWeight: '600',
  },
  modalText: {
    marginTop: 15,
    marginBottom: 10, 
    fontSize: 18,
    color: '#6200EE',  
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
  },
  button: {
    backgroundColor: '#6200EE', 
    padding: Platform.OS === 'android' ? 10 : 9,
    borderRadius: 5,
    width: '45%', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#B0BEC5', 
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileModal;
