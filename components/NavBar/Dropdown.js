import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';

// Sample data for users (Replace this with real data)
const profiles = [
  {
    id: 'user1',
    name: 'John Doe',
    profilePic: 'https://thumbs.dreamstime.com/b/abstract-dragon-drawing-abstract-dragon-drawing-dragon-silhouette-dark-background-332445834.jpg?w=768',
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    profilePic: 'https://thumbs.dreamstime.com/b/tcg-artwork-legendary-dragon-drawing-drawing-legendary-d-tcg-artwork-legendary-dragon-drawing-drawing-legendary-320007394.jpg?w=768',
  },
  {
    id: 'user3',
    name: 'Bob Johnson',
    profilePic: 'https://thumbs.dreamstime.com/b/little-anime-style-baby-dragon-pissed-off-breathing-fire-cartoon-character-emoji-illustration-vector-childish-emoticon-drawing-83996889.jpg?w=768',
  },
];

const Dropdown = () => {
  const [selectedProfile, setSelectedProfile] = useState(profiles[0]);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleProfileChange = (profile) => {
    setSelectedProfile(profile);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Display the current profile's name and picture */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.selectedProfileContainer}>
        <Image source={{ uri: selectedProfile.profilePic }} style={styles.profilePic} />
        <Text style={styles.profileName}>{selectedProfile.name}</Text>
        <MaterialIcons name='arrow-drop-down' size={24} color={'#fff'}/>
      </TouchableOpacity>

      {/* Modal to show the custom dropdown */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)} // Close the modal when clicked outside
        >
          <View style={styles.modalContainer}>
            <FlatList
              data={profiles}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleProfileChange(item)} style={styles.optionContainer}>
                  <Image source={{ uri: item.profilePic }} style={styles.optionProfilePic} />
                  <Text style={styles.optionName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  selectedProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    width: 250,
    // justifyContent:'center'
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'#fff',
    marginRight:50
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionProfilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  optionName: {
    fontSize: 16,
  },
});
