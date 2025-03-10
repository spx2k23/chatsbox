import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

const AnnouncementsInputBox = ({setShowContainer, tempData, setTempData }) => {
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
        mediaTypes: mediaType === 'image' ? ['images'] : ['videos'],
        quality: 1,
        aspect: [4, 3],
        allowsEditing: true,
      });
  
      if (!result.canceled && result.assets?.[0]?.uri) {
        const asset = result.assets[0];
  
        // Handling for videos
        if (asset.type === 'video') {
          setTempData([...tempData, { type: 'video', uri: asset.uri }]);
        } else if (asset.type === 'image') {
          // Handling for images
          setTempData([...tempData, { type: 'image', uri: asset.uri }]);
          
        }
  
        setShowContainer(true);
      } else {
        console.log(`Selection was canceled or failed for ${mediaType}`);
      }
    } catch (error) {
      console.error('Error opening media picker:', error);
      Alert.alert('Error', 'There was an issue opening the media picker.');
    }
  };
  
  

  // Handle document picker
  const handleDocSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/*', // Pick any file type
      });
      
      if (!result.canceled &&  result.assets.length > 0) {
        const doc=result.assets[0];
        setTempData([...tempData, { type: 'document', uri: doc.uri, name: doc.name}]);
        // console.log(tempData);
        setShowContainer(true);
        
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };
  
  // Handle audio recording
  const handleAudioSelect = async () => {
      
      setTempData([...tempData, { type: 'audio', uri: null,  }]);
      
      setShowContainer(true);
    
  };

  

  // Handle text input
  const handleAddText = () => {
    setTempData([...tempData, { type: 'text', content: '' }]);
    setShowContainer(true);
    // console.log(tempData);
    
  };

  const handleVoteSelect=()=>{
    setTempData([...tempData, { type: 'vote', vote:0 ,option:[{name:'Option - 1',votes:10},{name:'Option - 2',votes:20}],topic:'',voted:false}]);
    setShowContainer(true);
  }

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
      <TouchableOpacity onPress={handleVoteSelect}>
        <IconButton icon="view-headline" size={24} />
      </TouchableOpacity>
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
    margin:0,
    flex:1
  },
});

export default AnnouncementsInputBox;
