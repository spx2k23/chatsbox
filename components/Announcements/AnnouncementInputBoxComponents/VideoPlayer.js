import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons'; // Using MaterialIcons for the play icon

const VideoPlayer = ({ item, index }) => {
  const [showModal, setShowModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Track video play/pause state

  const handleVideoSelect = () => {
    setShowModal(true); // Open full-screen modal
  };

  const closeFullScreen = () => {
    setShowModal(false); // Close full-screen modal
  };
  

  return (
    <View style={styles.mediaContainer}>
      {/* Video Thumbnail with Play Icon Overlay */}
      <TouchableOpacity onPress={handleVideoSelect} style={styles.videoWrapper}>
        <Video
          source={{ uri: item.uri }}
          style={styles.video}
          resizeMode="cover"
        />

        {/* Play Icon Overlay */}
        {!isPlaying && (
          <View style={styles.playIconWrapper}>
            <MaterialIcons name="play-circle" size={60} color="white" onPress={handleVideoSelect} />
          </View>
        )}
      </TouchableOpacity>

      {/* Full-Screen Modal */}
      <Modal
        visible={showModal}
        animationType="fade"
        transparent={false}
        onRequestClose={closeFullScreen}
      >
        <View style={styles.fullScreenContainer}>
          <Video
            source={{ uri: item.uri }}
            style={styles.fullScreenVideo}
            useNativeControls
            resizeMode="contain"
            shouldPlay
          />
          <TouchableOpacity style={styles.closeButton} onPress={closeFullScreen}>
            <MaterialIcons name="close" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mediaContainer: {
    width: '100%',
    height: 200, // Adjust height as necessary
  },
  videoWrapper: {
    position: 'relative',
    width: '100%',
    height: 200, // Adjust height as necessary
  },
  video: {
    width: '95%',
    height: '100%',
    alignSelf:'center'
  },
  playIconWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    zIndex: 10, // Ensure the play icon is on top of the video
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenVideo: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 10,
    zIndex: 10,
  },
});

export default VideoPlayer;
