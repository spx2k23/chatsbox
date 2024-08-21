import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';

const formatTime = (milliseconds) => {
  if (milliseconds === null || milliseconds === undefined) return '0:00'; // Handle null or undefined values

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const AudioMessage = ({ uri }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [iconName, setIconName] = useState('play-arrow');
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(null);
  const positionInterval = useRef(null);

  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync({ uri });
        setSound(newSound);
  
        // Set the playback status update listener
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setDuration(status.durationMillis); // Set duration
            if (status.isPlaying) {
              setCurrentPosition(status.positionMillis); // Update current position
              setIsPlaying(true);
              setIconName('pause');
            } else {
              setIsPlaying(false);
              setIconName('play-arrow');
            }
            if (status.didJustFinish) {
              setIsPlaying(false);
              setIconName('play-arrow'); // Reset icon when audio finishes
            }
          } else if (status.error) {
            console.error("Playback status error:", status.error);
          }
        });
  
        // Initialize position interval
        positionInterval.current = setInterval(async () => {
          if (newSound) {
            const status = await newSound.getStatusAsync();
            if (status.isLoaded && status.isPlaying) {
              setCurrentPosition(status.positionMillis);
            }
          }
        }, 1000); // Update every second
      } catch (error) {
        console.error("Error loading sound:", error);
      }
    };
  
    loadSound();
  
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (positionInterval.current) {
        clearInterval(positionInterval.current);
      }
    };
  }, [uri]);

  const playPauseAudio = async () => {
    if (!sound) {
      return; // Exit if the sound is not loaded
    }

    try {
      const status = await sound.getStatusAsync();
      if (status.isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
        setIconName('play-arrow');
      } else {
        if (status.didJustFinish || status.positionMillis === status.durationMillis) {
          await sound.setPositionAsync(0); // Reset to the beginning if finished
        }
        await sound.playAsync();
        setIsPlaying(true);
        setIconName('pause');
      }
    } catch (error) {
      console.error("Error playing/pausing audio:", error);
    }
  };

  return (
    <View style={styles.audiocontainer }>
      <TouchableOpacity onPress={playPauseAudio}>
        <MaterialIcons name={iconName} size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.audiotimer}>
        {formatTime(currentPosition)} / {formatTime(duration)}
      </Text>
    </View>
  );
};

export default AudioMessage;

const styles=StyleSheet.create({
        audiocontainer:{
            display:'flex',
            flexDirection:'row',
        } ,
        audiotimer:{
            color:'#fff',
            marginLeft:10,
        }
});