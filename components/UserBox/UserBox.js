import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, Modal } from "react-native";
import ProfileModal from "./ProfileModal";

const UserBox = ({ image, firstName, lastName, email, role, bio, isFriend, isRequestSent, isRequestReceived, userId, receiverId, updateUserStatus }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

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
        onPress={() => !isRequestSent && !isRequestReceived && setModalVisible(true)}
      >
        <View style={[styles.card, pressed ? styles.pressed : null]}>
          <Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{firstName} {lastName}</Text>
            <Text style={styles.email}>{email}</Text>
            <Text style={styles.UserLabel}>{buttonLabel}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <ProfileModal firstName={firstName} lastName={lastName} image={image} email={email} role={role} 
        bio={bio} userId={userId} receiverId={receiverId} updateUserStatus={updateUserStatus}
        setModalVisible={setModalVisible} modalVisible={modalVisible} isFriend={isFriend}
      />
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