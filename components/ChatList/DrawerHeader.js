import React, { useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';


import { LogoutModal } from '../Logout/LogoutModal';

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
      <Text style={styles.poweredbytext}>Powered by Sprexcel</Text>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.logoutText}>Logout</Text>
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
    height:100,
    marginBottom:10,
    justifyContent:'center'
  },
  heading: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign:'center',
  },
  logoutButton: {
    padding: 15,
    backgroundColor: '#832dfc',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
  poweredbytext:{
    color:'#832dfc',
    textAlign:'center',
    marginBottom:5
  }
});

export default DrawerHeader;
