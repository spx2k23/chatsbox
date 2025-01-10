import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import AudioPlayer from './AudioPlayer';
import { MaterialIcons } from '@expo/vector-icons';

export default function AudioRecorder({ audioUri, setTempData, tempData, index }) {
  const [recording, setRecording] = useState(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function startRecording() {
    try {
      if (permissionResponse.status !== 'granted') {
        await requestPermission();
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const updatedTempData = [...tempData];
      updatedTempData[index] = { ...updatedTempData[index], uri: uri, isRecording: false, recording: null };
      setTempData(updatedTempData);
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
            <MaterialIcons name={recording?'stop':'mic'} color={'#fff'} size={24}/>
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
    paddingVertical:10,
    paddingHorizontal:10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    gap:5
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