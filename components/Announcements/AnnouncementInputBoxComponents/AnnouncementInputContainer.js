import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image, Text, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import Video from 'react-native-video'; // For displaying video previews

const windowWidth = Dimensions.get('window').width;

const AnnouncementInputContainer = ({ setShowContainer, tempData, setTempData , setAnnouncements, announcements,}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState();

  // Handle text change
  const handleTextChange = (index, text) => {
    const updatedData = [...tempData];
    updatedData[index].content = text;
    setTempData(updatedData);
  };

  // Handle image selection
  const handleImageSelect = async (index) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.photo],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const updatedData = [...tempData];
      updatedData[index].uri = result.assets[0].uri;
      setTempData(updatedData);
    }
  };

  // Handle video selection
  const handleVideoSelect = async (index) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.video],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const updatedData = [...tempData];
      updatedData[index].uri = result.assets[0].uri;
      setTempData(updatedData);
    }
  };

  // Start audio recording
  const startRecording = async (index) => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status === 'granted') {
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
        setIsRecording(true);
        await recording.startAsync();
      } else {
        alert('Permission to access audio is required!');
      }
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  // Stop audio recording
  const stopRecording = async (index) => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const updatedData = [...tempData];
      updatedData[index].uri = uri;
      updatedData[index].isRecording = false;
      setTempData(updatedData);
      setRecording(null);
      setIsRecording(false);
    }
  };

  // Pick document (PDF, DOC, etc.)
  const handleDocSelect = async (index) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      if (result.type === 'success') {
        const updatedData = [...tempData];
        updatedData[index].uri = result.uri;
        setTempData(updatedData);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  // Remove item from tempData
  const removeItem = (index) => {
    const updatedData = tempData.filter((item, i) => i !== index); // This will properly update the state
    setTempData(updatedData);
  };

  // Handle closing: Clear data and close the container
  const handleClose = () => {
    setTempData([]); // Clear the data
    setShowContainer(false); // Close the container
  };

  // Handle send: Log the data (can be replaced with an API call)
  const handleSend = () => {
    // Filter out text items with empty content
    const filteredData = tempData.filter(item => !(item.type === 'text' && item.content === ''));
  
    if (filteredData.length === 0) {
      alert('No data to send!');
      return;
    }
  
    const newGroup = filteredData.map(item => ({
      ...item, 
      id: Math.random() * 500 // Or a better way to generate unique IDs
    }));
  
    setAnnouncements(prevAnnouncements => [
      ...prevAnnouncements,  // Keep previous announcements
      newGroup  // Add new group of content
    ]);
  
    setTempData([]);
    setShowContainer(false); // Optionally close the container after sending
  };
  

  return (
   
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80} // Adjust based on your layout
      >
        {/* Close Button */}
        <TouchableOpacity onPress={handleClose} style={styles.close}>
          <IconButton icon="close" size={24}  />
        </TouchableOpacity>

        {/* ScrollView to make content scrollable */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Render content based on the type (text, image, audio, video) */}
          {tempData.map((item, index) => {
            return (
              <View key={index} style={styles.inputBlock}>
                {/* Remove Button */}
                <TouchableOpacity onPress={() => removeItem(index)} style={styles.removeButton}>
                  <IconButton icon="close" size={18} />
                </TouchableOpacity>

                {/* Render each content type */}
                {item.type === 'text' && (
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your text..."
                    value={item.content}
                    onChangeText={(text) => handleTextChange(index, text)}
                    multiline
                    numberOfLines={6}
                    autoCapitalize="none"
                    autoFocus={index === tempData.length - 1} // Ensures the active field is focused
                  />
                )}

                {item.type === 'image' && (
                  <View style={styles.mediaContainer}>
                    {item.uri ? (
                      <Image source={{ uri: item.uri }} style={styles.image} />
                    ) : (
                      <TouchableOpacity onPress={() => handleImageSelect(index)}>
                        <IconButton icon="image" size={24} />
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                {item.type === 'video' && (
                  <View style={styles.mediaContainer}>
                    {item.uri ? (
                      <Video
                        source={{ uri: item.uri }}
                        style={styles.video}
                        controls={true}
                        resizeMode="contain"
                      />
                    ) : (
                      <TouchableOpacity onPress={() => handleVideoSelect(index)}>
                        <IconButton icon="video" size={24} />
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                {item.type === 'audio' && (
                  <View style={styles.mediaContainer}>
                    {item.isRecording ? (
                      <TouchableOpacity onPress={() => stopRecording(index)}>
                        <IconButton icon="stop-circle" size={24} />
                      </TouchableOpacity>
                    ) : (
                      <Text>Audio saved</Text>
                    )}
                  </View>
                )}

                {/* Document Picker Icon */}
              </View>
            );
          })}
        </ScrollView>

        {/* Send Button */}
        <TouchableOpacity onPress={handleSend}>
          <IconButton icon="send" size={24} style={styles.send} iconColor="#6200EE" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: 500, // Fixed height for container
    width: windowWidth * 0.9,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    bottom: -150,
    zIndex: 10,
  },
  close: {
    alignSelf: 'flex-end',
    margin: 5,
    fontSize: 18,
  },
  inputBlock: {
    marginBottom: 15,
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 1,
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 8,
    width: '85%',
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  video: {
    width: '100%',
    height: 200,
    marginBottom: 8,
  },
  mediaContainer: {
    marginBottom: 10,
  },
  send: {
    alignSelf: 'flex-end',
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default AnnouncementInputContainer;
