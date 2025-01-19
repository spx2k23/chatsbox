import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Audio,InterruptionModeIOS,InterruptionModeAndroid } from 'expo-av';
import AudioPlayer from './AudioPlayer';
import { MaterialIcons } from '@expo/vector-icons';

export default function AudioRecorder({ audioUri, setTempData, tempData, index }) {
  const [recording, setRecording] = useState(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const recordingSettings = {
    android: {
      extension: '.m4a',
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: '.m4a',
      outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };

  // Function to prepare the recorder before starting
  async function prepareRecording() {
    try {
      if (permissionResponse.status !== 'granted') {
        const { status } = await requestPermission();
        if (status !== 'granted') {
          console.error('Permission not granted');
          return false; // Return false if permission is not granted
        }
      }

      // Set audio mode for recording on iOS
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
      });

      return true; // Return true if preparation is successful
    } catch (err) {
      console.error('Failed to prepare recording', err);
      return false; // Return false if preparation fails
    }
  }

  // Function to start recording
  async function startRecording() {
    try {
      // Prepare the recorder before starting
      const isPrepared = await prepareRecording();
      if (!isPrepared) {
        return; // Exit if preparation failed
      }
      if (recording) {
        console.log('Stopping previous recording...');
        await recording.stopAndUnloadAsync();
        setRecording(null); // Reset the recording state
        console.log('Previous recording stopped');
      }
      // Create and start the recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording); // Store the recording instance
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  // Function to stop recording
  async function stopRecording() {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const updatedTempData = [...tempData];
      updatedTempData[index] = { ...updatedTempData[index], uri: uri, isRecording: false, recording: null };
      setTempData(updatedTempData); // Update the state with the new audio URI
      console.log('Recording stopped');
    }
  }

  return (
    <View style={styles.container}>
      {
        !audioUri && (
          <TouchableOpacity 
            onPress={recording ? stopRecording : startRecording} 
            style={[styles.recordButton, recording ? styles.stopButton : styles.startButton]}
          >
            <MaterialIcons name={recording ? 'stop' : 'mic'} color={'#fff'} size={24} />
            <Text style={styles.buttonText}>{recording ? 'Stop Recording' : 'Start Recording'}</Text>
          </TouchableOpacity>
        )
      }
      {audioUri && <AudioPlayer uri={audioUri} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  recordButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  startButton: {
    backgroundColor: '#6200EE', // Color for start recording
  },
  stopButton: {
    backgroundColor: '#D32F2F', // Color for stop recording
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
