import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput, Platform, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Audio from 'expo-av';

const { height: screenHeight } = Dimensions.get('window'); // Get the screen height

const AnnouncementsInputBox = ({ scrollViewRef }) => {
  const [recording, setRecording] = useState(null);
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(40);

  const maxHeight = 6 * 24; // Max height based on 6 lines (24px per line, adjust as needed)
  const lineHeight = 24; // Line height for multiline text (adjust if necessary)

  // Create a ref for the TextInput to handle focus events
  const textInputRef = useRef(null);

  // Function to handle TextInput focus event
  const handleFocus = () => {
    // Check if scrollViewRef is available and scroll to input
    scrollViewRef.current.scrollToFocusedInput(textInputRef.current);
  };

  // Handle media pick (image/video)
  const handlePickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const { type, uri } = asset;

      const newMessage = {
        _id: Math.random().toString(),
        createdAt: new Date(),
        user: { _id: 'user_id', name: 'user_name' }, // Replace with dynamic user info
        [type]: uri, // Dynamically add either image or video
      };

      // Assuming `onSend` is passed down as a prop
      onSend([newMessage]);
    }
  };

  // Handle document pick
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      const { name, uri } = result.assets[0];

      if (!result.canceled) {
        const newMessage = {
          _id: Math.random().toString(),
          createdAt: new Date(),
          user: { _id: 'user_id', name: 'user_name' }, // Replace with dynamic user info
          text: name,
          document: uri,
        };
        onSend([newMessage]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  // Start recording audio
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status === 'granted') {
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
      } else {
        alert('Permission to access microphone is required!');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  // Stop recording audio
  const stopRecording = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setSoundUri(uri);

        const newMessage = {
          _id: Math.random().toString(),
          createdAt: new Date(),
          user: { _id: 'user_id', name: 'user_name' }, // Replace with dynamic user info
          audio: uri,
        };

        onSend([newMessage]);
        setRecording(null);
      } catch (err) {
        console.error('Failed to stop recording', err);
      }
    }
  };

  // Conditionally render the icon based on whether recording is in progress
  const renderRecordingButton = () => {
    return (
      <TouchableOpacity onPress={recording ? stopRecording : startRecording} style={styles.iconButton}>
        <MaterialIcons name={recording ? 'stop' : 'mic'} size={20} color="#575757" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.inputWrapper}>
      {/* Icons Section (Camera, File, Mic) */}
      <View style={styles.iconsWrapper}>
        <TouchableOpacity onPress={handlePickMedia} style={styles.iconButton}>
          <MaterialIcons name="camera-alt" size={20} color="#575757" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePickDocument} style={styles.iconButton}>
          <MaterialIcons name="insert-drive-file" size={20} color="#575757" />
        </TouchableOpacity>
        {renderRecordingButton()}
      </View>

      {/* Text input field */}
      <TextInput
        ref={textInputRef}
        placeholder="Type your announcement here..."
        style={[styles.input]} // Dynamically set height
        onChangeText={setMessage}
        value={message}
        multiline
        textAlignVertical="top"
        numberOfLines={6}
        onFocus={handleFocus} // Trigger scroll on focus
        onContentSizeChange={(contentWidth, contentHeight) => {
          // Adjust input height based on content height (with a maximum height limit)
          setInputHeight(contentHeight);
        }}
      />

      {/* Send Button (only shows when there's text) */}
      {message !== '' && (
        <TouchableOpacity style={styles.sendButton}>
          <MaterialIcons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AnnouncementsInputBox;

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
    position: 'absolute',
    bottom: 0, // Position at the bottom of the screen
    left: 0,
    backgroundColor: '#ddd',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row', // Align everything horizontally
    alignItems: 'flex-end',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight:150
  },
  input: {
    flex: 1, // Allow the input to take up available space
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#ddd',
    borderRadius: 12,
    minHeight: 40,
    textAlignVertical: 'top',
    marginLeft: 10, // Add margin to the left to separate the icons
  },
  sendButton: {
    backgroundColor: '#6200EE',
    borderRadius: 50,
    padding: 10,
    marginLeft: 10,
  },
  iconsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft:-15
  },
  iconButton: {
    marginLeft:8,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
