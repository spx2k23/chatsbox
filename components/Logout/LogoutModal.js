
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LogoutModal = ({ isVisible, onClose,navigation}) => {

    const handleLogout = async () => {
        try { 
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("organization");
          navigation.navigate('Login');
        } catch (error) {
          console.error('Error clearing token', error);
        } finally {
          onClose(false);
        }
      };
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Are you sure you want to logout?</Text>
          <View style={styles.buttonContainer}>
            <Button 
              title="Cancel" 
              buttonStyle={styles.cancelButton} 
              onPress={onClose} 
            />
            <Button 
              title="Logout" 
              buttonStyle={styles.logoutButton} 
              onPress={handleLogout} 
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 30,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cancelButton: {
    backgroundColor: '#B0BEC5',
  },
  logoutButton: {
    backgroundColor: '#6200EE',
  },
});
