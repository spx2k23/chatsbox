import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, Modal } from "react-native";
import ProfileModal from "./ProfileModal";
import theme from "../../config/theme";
import {s,ms,vs} from 'react-native-size-matters';
const UserBox = ({ image, firstName, lastName, email, role, bio, isFriend, isRequestSent, isRequestReceived, userId, receiverId, updateUserStatus }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  let buttonLabel;
  let buttonDisabled = false;

  if (isFriend||isRequestReceived||isRequestSent) {
    buttonDisabled = true;
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
          </View>
          <Text style={styles.role}>{role}</Text>
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
    // elevation: 5,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.15,
    // shadowRadius: 1.84,
    alignItems:'center'
  },
  pressed: {
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  image: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    marginRight: 10,
  },
  infoContainer: {
    flex: 5,
    justifyContent: 'center',
  },
  name: {
    fontSize: ms(16,.4),
    fontWeight: 'bold',
  },
  email: {
    fontSize: ms(14,.4),
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  role:{
    color:'grey',
    fontSize:ms(14,.4),
    marginRight:10,
    flex:3,
    fontWeight:'600'
  }
});

export default UserBox;