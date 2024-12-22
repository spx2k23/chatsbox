import React, { useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Platform } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { LogoutModal } from '../Logout/LogoutModal';
import { MaterialIcons } from '@expo/vector-icons';
import Dropdown from '../NavBar/Dropdown';

function DrawerHeader(props) {
 
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Text style={styles.heading}>Welcome</Text> */}
        <Dropdown/>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={1}
      >
        <Text style={styles.logoutText}>Logout</Text>
        <MaterialIcons name="exit-to-app" size={24} color='#fff'/>
      </TouchableOpacity>
      <LogoutModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        navigation={props.navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#6200EE',
    height: Platform.OS === 'ios' ? 120 : 100,
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
    justifyContent: 'center',
    marginBottom:Platform.OS=='android'?10:-50
  },
  logoutButton: {
    paddingVertical: 15,
    backgroundColor: '#6200EE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 8, // Add some space between the icon and the text
  },
});
export default DrawerHeader;
