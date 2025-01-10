import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const formatTime = (milliseconds) => {
  if (milliseconds === null || milliseconds === undefined) return '0:00';
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const AudioPlayer = ({ uri }) => {
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

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setDuration(status.durationMillis);
            if (status.isPlaying && !isPlaying) {
              setIsPlaying(true);
              setIconName('pause');
            } else if (!status.isPlaying && isPlaying) {
              setIsPlaying(false);
              setIconName('play-arrow');
            }
            if (status.didJustFinish) {
              setIsPlaying(false);
              setIconName('play-arrow');
            }
            setCurrentPosition(status.positionMillis);
          } else if (status.error) {
            console.error("Playback status error:", status.error);
          }
        });

        positionInterval.current = setInterval(async () => {
          if (newSound) {
            const status = await newSound.getStatusAsync();
            if (status.isLoaded && status.isPlaying) {
              setCurrentPosition(status.positionMillis);
            }
          }
        }, 1000);
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
    if (!sound) return;

    try {
      const status = await sound.getStatusAsync();
      if (status.isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
        setIconName('play-arrow');
      } else {
        if (status.didJustFinish || status.positionMillis === status.durationMillis) {
          await sound.setPositionAsync(0);
        }
        await sound.playAsync();
        setIsPlaying(true);
        setIconName('pause');
      }
    } catch (error) {
      console.error("Error playing/pausing audio:", error);
    }
  };

  const onSliderValueChange = (value) => {
    setCurrentPosition(value);
  };

  const onSlidingComplete = async (value) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.audiotimer}>
        {formatTime(currentPosition)} / {formatTime(duration)}
      </Text>
      <View style={styles.controlsContainer}>
      <TouchableOpacity onPress={playPauseAudio} style={styles.playButton}>
          <MaterialIcons name={iconName} size={28} color="#6200EE" />
        </TouchableOpacity>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration || 1}
          value={currentPosition}
          onValueChange={onSliderValueChange}
          onSlidingComplete={onSlidingComplete}
          minimumTrackTintColor="#6200EE"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#6200EE"
        />
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#1E1E1E' ,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    borderColor:'#6200EE',
    borderWidth:1
  },
  audiotimer: {
    color: "#6200EE",
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  slider: {
    flex: 1,
    height: 30,
    marginRight: 10,
  },
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AudioPlayer;