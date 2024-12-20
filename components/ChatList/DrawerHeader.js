import React, { useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Platform } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { LogoutModal } from '../Logout/LogoutModal';
import { MaterialIcons } from '@expo/vector-icons';

function DrawerHeader(props) {
 
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Welcome</Text>
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
    padding: 20,
    backgroundColor: '#6200EE',
    height: Platform.OS === 'ios' ? 100 : 80,
    paddingTop: Platform.OS === 'ios' ? 60 : 0,
    marginBottom: 10,
    justifyContent: 'center',
  },
  heading: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
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
