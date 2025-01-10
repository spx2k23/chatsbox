import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as FileSystem from 'expo-file-system';

const getFileIcon = (fileType) => {
  const fileExtensions = {
    pdf: 'picture-as-pdf',
    doc: 'ios-document-text',
    docx: 'ios-document-text',
    txt: 'ios-paper',
    jpg: 'ios-image',
    jpeg: 'ios-image',
    png: 'ios-image',
    mp4: 'ios-videocam',
    mp3: 'ios-musical-notes',
    ppt: 'ios-albums',
    pptx: 'ios-albums',
    xls: 'ios-calculator',
    xlsx: 'ios-calculator',
  };

  return fileExtensions[fileType] || 'ios-document'; // Default icon
};

const openFile = async (uri) => {
  try {
    console.log('Opening file with URI:', uri);  // Debugging: Check if the function is triggered

    if (uri.startsWith('http') || uri.startsWith('https')) {
      // Handle remote files (HTTP/S)
      console.log('Detected remote file. Attempting to open in browser.');
      await WebBrowser.openBrowserAsync(uri);
    } else {
      // Handle local files (file://)
      console.log('Detected local file. Attempting to open.');

      // If the file URI is already a local file (file://), we don’t need to download it again
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        console.log('File does not exist at URI:', uri);
        return;
      }

      // Platform-specific file opening logic
      if (Platform.OS === 'android') {
        console.log('Opening file on Android:', uri);
        const contentUri = uri.replace('file://', 'content://');  // Convert file:// URI to content:// for Android
        Linking.openURL(contentUri);  // Open the file with content:// scheme on Android
      } else {
        console.log('Opening file on iOS:', `file://${uri}`);
        Linking.openURL(`file://${uri}`);  // Open the file with file:// scheme on iOS
      }
    }
  } catch (error) {
    console.error('Error opening file:', error);  // Debugging: Catch errors
  }
};

const DocViewer = ({ name, uri }) => {
  const fileExtension = name.split('.').pop().toLowerCase();
  const fileIcon = getFileIcon(fileExtension);

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() => openFile(uri)} // Use the modified openFile function
      >
        <View style={styles.iconContainer}>
          <MaterialIcons name={fileIcon} size={40} color="#6200EE" />
        </View>
        <Text style={styles.fileName}>{name}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth:1,
    borderColor:"#ccc",
    width:'95%',
    alignSelf:'center',
    overflow:"hidden"
  },
  iconContainer: {
    marginRight: 10,
  },
  fileName: {
    fontSize: 16,
    color: '#333',
   textAlign:'center'
  },
});

export default DocViewer;
