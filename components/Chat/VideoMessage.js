import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Button, StyleSheet, Dimensions, StatusBar, Image } from 'react-native';
import { Video } from 'expo-av';
import Slider from '@react-native-community/slider';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { MaterialIcons } from '@expo/vector-icons';
import debounce from 'lodash.debounce';

const VideoMessage = ({ currentMessage }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [timeline, setTimeline] = useState(0);
  const [duration, setDuration] = useState(0);
  const [orientation, setOrientation] = useState('PORTRAIT');
  const [thumbnail, setThumbnail] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const generateThumbnail = async () => {
      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(
          currentMessage.video,
          {
            time: 0,
          }
        );
        setThumbnail(uri);
      } catch (e) {
        console.warn(e);
      }
    };

    generateThumbnail();
  }, [currentMessage.video]);

  const handleLoad = (playbackStatus) => {
    if (playbackStatus.durationMillis) {
      setDuration(playbackStatus.durationMillis);
    }
  };

  const handleSliderChange = async (value) => {
    setTimeline(value);
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(value);
    }
  };

  const handlePlaybackStatusUpdate = (playbackStatus) => {
    if (playbackStatus.isLoaded) {
      setTimeline(playbackStatus.positionMillis);
      setIsPlaying(playbackStatus.isPlaying);
    }
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await videoRef.current.playAsync();
        setIsPlaying(true);
      }
      setOverlayVisible(true);
      setTimeout(() => setOverlayVisible(false), 2000); // Hide overlay after 2 seconds
    }
  };

  const openModal = async () => {
    StatusBar.setHidden(true, 'fade');
    setModalVisible(true);
  };

  const closeModal = async () => {
    StatusBar.setHidden(false, 'fade');
    setModalVisible(false);
  };

  useEffect(() => {
    const updateOrientation = async () => {
      const orientation = await ScreenOrientation.getOrientationAsync();
      if (
        orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      ) {
        setOrientation('LANDSCAPE');
      } else {
        setOrientation('PORTRAIT');
      }
    };

    updateOrientation();

    const subscription = ScreenOrientation.addOrientationChangeListener(() => {
      updateOrientation();
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
      StatusBar.setHidden(false, 'fade');
    };
  }, []);

  return (
    <View>
      <TouchableOpacity onPress={openModal}>
        <View style={styles.thumbnailContainer}>
          {thumbnail ? (
            <View style={styles.thumbnailOverlay}>
              <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
              <MaterialIcons name='play-arrow' style={styles.playIcon}/>
            </View>
          ) : (
            <View style={styles.videoPlaceholder}>
              <MaterialIcons name='play-arrow' style={styles.videoText}/>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.videoTouchable}
            onPress={togglePlayPause}
            activeOpacity={1} // Prevents the TouchableOpacity from interfering with video controls
          >
            <Video
              ref={videoRef}
              source={{ uri: currentMessage.video }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="contain"
              shouldPlay={isPlaying}
              style={orientation === 'LANDSCAPE' ? styles.fullScreenVideo : styles.normalScreenVideo}
              onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
              onLoad={handleLoad}
            />
            {overlayVisible && (
              <View style={styles.overlay}>
                <MaterialIcons
                  name={isPlaying ? 'pause' : 'play-arrow'}
                  style={styles.icon}
                />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.sliderContainer}>
            {/* <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={timeline}
              onValueChange={handleSliderChange}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            /> */}
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(timeline)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.closebtn} onPress={closeModal}>
              <Text style={{ fontSize: 24, color: 'white' }}>X</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const formatTime = (milliseconds) => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
};

export default VideoMessage;

const styles = StyleSheet.create({
  thumbnailContainer: {
    width: 200,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailOverlay: {
    position: 'relative',
    width: 200,
    height: 150,
  },
  playIcon: {
    position: 'absolute',
    color: 'white',
    fontSize: 54,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -27 }, { translateY: -27 }], // Center the icon
  },
  videoPlaceholder: {
    width: 200,
    height: 150,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenVideo: {
    width: Dimensions.get('window').height,
    height: Dimensions.get('window').width,
  },
  normalScreenVideo: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.6,
  },
  sliderContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  slider: {
    width: Dimensions.get('window').width - 40,
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width - 40,
    paddingHorizontal: 20,
  },
  timeText: {
    color: 'white',
  },
  thumbnail: {
    width: 200,
    height: 150,
    resizeMode: 'cover',
  },
  videoTouchable: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: 'white',
    fontSize: 54,
  },
  closebtn:{
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  borderRadius: 20, 
  padding: 10, 
  width: 50, 
  height: 50, 
  justifyContent: 'center', 
  alignItems: 'center', 
  position: 'absolute', 
  top: 10, 
  right: 10
  }
});
