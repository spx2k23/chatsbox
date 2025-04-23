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
import { useSQLiteContext } from 'expo-sqlite';
import theme from '../../../config/theme';
import * as FileSystem from 'expo-file-system';


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

  const db = useSQLiteContext();

  useEffect(() => {
    const fetchOrgAndUser = async () => {
      try {
        const firstRow = await db.getFirstAsync(`SELECT * FROM user`);
        setUserId(firstRow.userId);
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

  // Handle send: Log the data (can be replaced with an API call)
  // const handleSend = () => {
  //   // Filter out text items with empty content and audio items with null URI
  //   const filteredData = tempData.filter(item => {
  //     if (item.type === 'text') {
  //       return item.content !== ''; // Keep text items with non-empty content
  //     }
  //     if (item.type === 'audio') {
  //       return item.uri !== null; // Keep audio items with a non-null URI
  //     }
  //     return true; // Keep other item types
  //   });

  //   if (filteredData.length === 0) {
  //     alert('No data to send!');
  //     return;
  //   }

  //   const newGroup = filteredData.map(item => ({
  //     ...item, 
  //     id: Math.random() * 500 ,
  //     date:new Date(),
  //     name:'Drago Malphoy'

  //   }));

  //   setAnnouncements(prevAnnouncements => [
  //     ...prevAnnouncements,  // Keep previous announcements
  //     newGroup  // Add new group of content
  //   ]);


  //   setTempData([]);
  //   setShowContainer(false); // Optionally close the container after sending
  // };

  const handleSend = async () => {
    try {
      // Filter out empty text items
      const filteredData = tempData.filter(item => { 
        if (item.type === 'text') return item.content.trim() !== '';
        return true;
      });
  
      if (filteredData.length === 0) {
        alert('No data to send!');
        return;
      }
      console.log("enter");
      
  
      // Prepare messages for the mutation
      const messages = (
        await Promise.all(
          filteredData.map(async (item, index) => {
            let content;
      
            if (item.uri && ['image', 'video', 'document', 'audio'].includes(item.type)) {
              // Check if the URI is a local file path
              if (item.uri.startsWith('file://')) {
                try {
                  // Read the file as Base64
                  const base64 = await FileSystem.readAsStringAsync(item.uri, {
                    encoding: FileSystem.EncodingType.Base64,
                  });
                  console.log('Base64 content fetched successfully');
                  content = `data:${item.type === 'image' ? 'image/jpeg' : item.type === 'video' ? 'video/mp4' : 'application/octet-stream'};base64,${base64}`;
                } catch (error) {
                  console.error('Error reading local file:', error);
                  return null;
                }
              } else {
                // For HTTP(S) URLs, use the URI directly as the content
                content = item.uri;
              }
            } else {
              // For text messages, use the content directly
              content = item.content || '';
            }
      
            return {
              type: item.type || 'text',
              content: content, // Ensure the content field is always populated
              order: index + 1,
            };
          })
        )
      ).filter(Boolean); // Remove any null values caused by errors
      console.log('Prepared messages:', messages);
  
      // Create the announcement
      const { data } = await createAnnouncement({ 
        variables: {
          createdBy: userId, // Replace with actual user ID
          messages,
        },
      });
  
      console.log('Announcement created:', data.createAnnouncement);
  
      if (data.createAnnouncement.success) {
        alert(data.createAnnouncement.message); // Success message
      } else {
        alert(`Error: ${data.createAnnouncement.message}`); // Error message
      }
  
      // Clear state and close the container
      setTempData([]);
      setShowContainer(false);
    } catch (error) {
      console.error('Error sending announcement:', error);
      alert('Failed to send announcement. Please try again.');
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
  keyboardAvoidingViewStyle:{
    position: 'absolute',
    zIndex:1,
    bottom:10
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
