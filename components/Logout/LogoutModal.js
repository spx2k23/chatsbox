
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../config/theme';

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
          <Text style={[styles.modalText,styles.logoutText]}>Logout</Text>
          <Text style={styles.modalText}>Are you sure?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={{  color:'#fff'}}>No</Text>
            </TouchableOpacity> 
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
    alignItems:'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width:'62%',
    borderRadius: 10,
    paddingBottom:30
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutButton: {
    borderRadius:8,
    borderWidth:1,
    paddingHorizontal:25,
    marginRight:10
  },
  cancelButton: {
    backgroundColor: theme.colors.basicColor,
    paddingHorizontal:25,
    borderRadius:8,
  
  },
  logoutText:{
    color:'red',
    fontWeight:'600',
  }
});
