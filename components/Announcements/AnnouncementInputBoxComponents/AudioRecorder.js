import { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import AudioPlayer from './AudioPlayer';
import { MaterialIcons } from '@expo/vector-icons';
import theme from '../../../config/theme';

export default function AudioRecorder({ audioUri, setTempData, tempData, index }) {
  const [recording, setRecording] = useState(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const recordingSettings = Audio.RecordingOptionsPresets.HIGH_QUALITY; // Use preset for simplicity

  async function prepareRecording() {
    try {
      // Check if permissions are granted
      if (!permissionResponse || permissionResponse.status !== 'granted') {
        console.log('Requesting permissions...');
        const { status } = await requestPermission();
        if (status !== 'granted') {
          console.error('Permission not granted');
          return false;
        }
      }

      // Set audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });

      console.log('Recording prepared successfully');
      return true;
    } catch (err) {
      console.error('Failed to prepare recording', err);
      return false;
    }
  }

  async function startRecording() {
    try {
      // Prepare the recorder
      const isPrepared = await prepareRecording();
      if (!isPrepared) {
        console.error('Recording preparation failed');
        return;
      }

      // Stop any existing recording
      if (recording) {
        console.log('Stopping previous recording...');
        await recording.stopAndUnloadAsync();
        setRecording(null);
      }

      // Start a new recording
      console.log('Starting new recording...');
      const { recording: newRecording } = await Audio.Recording.createAsync(
        recordingSettings
      );
      setRecording(newRecording);
      console.log('Recording started successfully');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    try {
      if (recording) {
        console.log('Stopping recording...');
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        const updatedTempData = [...tempData];
        updatedTempData[index] = { ...updatedTempData[index], uri: uri, isRecording: false, recording: null };
        setTempData(updatedTempData);
        setRecording(null);
        console.log('Recording stopped and saved:', uri);

        // Reset audio mode after recording
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          playThroughEarpieceAndroid: false,
          staysActiveInBackground: false,
        });
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }

  return (
    <View style={styles.container}>
      {!audioUri && (
        <TouchableOpacity 
          onPress={recording ? stopRecording : startRecording} 
          style={[styles.recordButton, recording ? styles.stopButton : styles.startButton]}
        >
          <MaterialIcons name={recording ? 'stop' : 'mic'} color={'#fff'} size={24} />
          <Text style={styles.buttonText}>{recording ? 'Stop Recording' : 'Start Recording'}</Text>
        </TouchableOpacity>
      )}
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
    backgroundColor: theme.colors.basicColor,
  },
  stopButton: {
    backgroundColor: '#D32F2F',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});