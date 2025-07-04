import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image, Text, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio, Video } from 'expo-av';
import VideoPlayer from './VideoPlayer';
import DocViewer from './DocViewer';
import AudioRecorder from './AudioRecorder';
import VoteInputEditor from './Vote/VoteInputEditor';
import { gql, useMutation } from '@apollo/client';
import theme from '../../../config/theme';
import * as FileSystem from 'expo-file-system';
import { ReactNativeFile } from 'apollo-upload-client';
import realm from '../../../db_configs/realm';

const CREATE_ANNOUNCEMENT_MUTATION = gql`
  mutation CreateAnnouncement($createdBy: ID!, $messages: [MessageInput!]!) {
    createAnnouncement(createdBy: $createdBy, messages: $messages) {
      success
      message
    }
  }
`;

const windowWidth = Dimensions.get('window').width;

const AnnouncementInputContainer = ({ setShowContainer, tempData, setTempData, setAnnouncements, announcements, }) => {

  const [createAnnouncement] = useMutation(CREATE_ANNOUNCEMENT_MUTATION);

  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchOrgAndUser = async () => {
      try {
        const user = realm.objects('User')[0];
        setUserId(user.userId);
      } catch (error) {
        console.error('Error fetching organization or user:', error);
      }
    };
    fetchOrgAndUser();
  }, []);

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

  const handleSend = async () => {
    try {
      const filteredData = tempData.filter(item =>
        item.type === 'text' ? item.content.trim() !== '' : true
      );

      if (filteredData.length === 0) {
        alert('No data to send!');
        return;
      }

      const messages = filteredData.map((item, index) => {
        if (['image', 'video', 'document', 'audio'].includes(item.type)) {
          const file = new ReactNativeFile({
            uri: item.uri,
            name: item.name || `file-${index}.jpeg`,
            type: item.mimeType || 'image/jpeg',
          });

          return {
            type: item.type,
            file,
            order: index + 1,
          };
        } else {
          return {
            type: item.type || 'text',
            content: item.content,
            order: index + 1,
          };
        }
      });

      const { data } = await createAnnouncement({
        variables: {
          createdBy: userId,
          messages,
        },
      });

      if (data.createAnnouncement.success) {
        alert(data.createAnnouncement.message);
      } else {
        alert(`Error: ${data.createAnnouncement.message}`);
      }

      setTempData([]);
      setShowContainer(false);
    } catch (error) {
      console.error('Error sending announcement:', error);
      alert('Failed to send announcement. Please try again.');
    }
  };

  const getMimeType = (uri) => {
    const extension = uri.split('.').pop().toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'mp4':
        return 'video/mp4';
      case 'pdf':
        return 'application/pdf';
      case 'mp3':
        return 'audio/mpeg';
      default:
        return 'application/octet-stream';
    }
  };

  return (

    <KeyboardAvoidingView
      style={styles.keyboardAvoidingViewStyle}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80} // Adjust based on your layout
    >
      <View style={styles.container}>
        {/* Close Button */}
        <TouchableOpacity onPress={handleClose} style={styles.close}>
          <IconButton icon="close" size={24} />
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
                      <VideoPlayer item={item} />
                    ) : (
                      <TouchableOpacity onPress={() => handleVideoSelect(index)}>
                        <IconButton icon="video" size={24} />
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                {item.type === 'audio' && (
                  <View style={styles.mediaContainer}>
                    <AudioRecorder key={index} type="audio" audioUri={item.uri} setTempData={setTempData} tempData={tempData} index={index} />
                  </View>
                )}

                {item.type === 'document' && (
                  <View style={styles.mediaContainer}>
                    <DocViewer name={item.name} uri={item.uri} />
                  </View>
                )}
                {
                  item.type === 'vote' && (
                    <VoteInputEditor tempData={tempData} setTempData={setTempData} key={index} index={index} />
                  )}

              </View>
            );
          })}
        </ScrollView>

        {/* Send Button */}
        <TouchableOpacity onPress={handleSend}>
          <IconButton icon="send" size={24} style={styles.send} iconColor={theme.colors.basicColor} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  keyboardAvoidingViewStyle: {
    position: 'absolute',
    zIndex: 1,
    bottom: 10
  },
  container: {
    backgroundColor: '#fff',
    height: 500,
    width: windowWidth * 0.9,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,

  },
  close: {
    alignSelf: 'flex-end',
    margin: 5,
    fontSize: 18,
  },
  inputBlock: {
    marginBottom: 5,
    position: 'relative',
  },
  removeButton: {
    alignSelf: 'flex-end',
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
  // video: {
  //   width: 'auto',
  //   height: 200,
  //   marginBottom: 8,
  // },
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
