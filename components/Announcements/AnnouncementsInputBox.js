import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

const AnnouncementsInputBox = ({ setAnnouncement, announcement, showContainer, setShowContainer, tempData, setTempData }) => {
  const [imagePickerPermission, setImagePickerPermission] = useState(false);

  // Request media library permission when component mounts
  useEffect(() => {
    const checkPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setImagePickerPermission(status === 'granted');
    };

    checkPermissions();
  }, []);

  // General media selection handler (for both image and video)
  const handleMediaSelect = async (mediaType) => {
    if (!imagePickerPermission) {
      Alert.alert(
        'Permission Required',
        `This app needs access to your photos to select ${mediaType}.`,
        [
          {
            text: 'Grant Permission',
            onPress: async () => {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status === 'granted') {
                setImagePickerPermission(true);
                openMediaPicker(mediaType); // Open media picker after permission is granted
              } else {
                Alert.alert('Permission Denied', `We need access to your photo library to select ${mediaType}.`);
              }
            },
          },
          {
            text: 'Cancel',
            onPress: () => console.log('Permission request canceled'),
            style: 'cancel',
          },
        ]
      );
    } else {
      openMediaPicker(mediaType); // Open media picker directly if permission is already granted
    }
  };

  // Function to open media picker (images or videos)
  const openMediaPicker = async (mediaType) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:( mediaType === 'image' )? ['images']:['videos'],
        quality: 1,
        aspect: [4, 3],
      });

      
      if (!result.canceled && result.assets?.[0]?.uri) {
        setTempData([...tempData, { type: mediaType, uri: result.assets[0].uri }]);
        setShowContainer(true);
      } else {
        console.log(`${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} selection was canceled or failed.`);
      }
    } catch (error) {
      console.error(`Error opening ${mediaType} picker:`, error);
      Alert.alert('Error', `There was an issue opening the ${mediaType} picker.`);
    }
  }

  // Handle document picker
  const handleDocSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Pick any file type
      });

      if (result.type === 'success') {
        setTempData([...tempData, { type: 'document', uri: result.uri }]);
        setShowContainer(true);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  // Handle audio recording
  const handleAudioSelect = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status === 'granted') {
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      setTempData([...tempData, { type: 'audio', uri: null, isRecording: true, recording }]);
      setShowContainer(true);
    } else {
      alert('Permission to access audio is required!');
    }
  };

  // Handle stop audio recording
  const handleStopRecording = async (index) => {
    const updatedData = [...tempData];
    const recordingItem = updatedData[index];

    if (recordingItem?.recording) {
      await recordingItem.recording.stopAndUnloadAsync();
      const uri = recordingItem.recording.getURI();
      updatedData[index] = { ...recordingItem, uri, isRecording: false };
      setTempData(updatedData);
    }
  };

  // Handle text input
  const handleAddText = () => {
    setTempData([...tempData, { type: 'text', content: '' }]);
    setShowContainer(true);
    // console.log(tempData);
    
  };

  return (
    <View style={styles.inputContainer}>
      {/* Image Icon */}
      <TouchableOpacity onPress={() => handleMediaSelect('image')}>
        <IconButton icon="image" size={24} />
      </TouchableOpacity>

      {/* Video Icon */}
      <TouchableOpacity onPress={() => handleMediaSelect('video')}>
        <IconButton icon="video" size={24} />
      </TouchableOpacity>

      {/* Audio Icon */}
      <TouchableOpacity onPress={handleAudioSelect}>
        <IconButton icon="microphone" size={24} />
      </TouchableOpacity>

      {/* Text Icon */}
      <TouchableOpacity onPress={handleAddText}>
        <IconButton icon="text-box-plus-outline" size={24} />
      </TouchableOpacity>

      {/* Document Icon */}
      <TouchableOpacity onPress={handleDocSelect}>
        <IconButton icon="file-document" size={24} />
      </TouchableOpacity>

      {/* Handle stop recording for audio if recording */}
      {tempData.map((item, index) => {
        return item.type === 'audio' && item.isRecording ? (
          <TouchableOpacity key={index} onPress={() => handleStopRecording(index)}>
            <IconButton icon="stop-circle" size={24} />
          </TouchableOpacity>
        ) : null;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    margin:0
  },
});

export default AnnouncementsInputBox;
