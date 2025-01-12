import React from 'react';
import { Linking, View, TouchableOpacity, Text, Platform, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

const DocViewer = ({ uri, name }) => {
  const handlePress = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        Alert.alert('Error', 'File does not exist.');
        return;
      }

      const tempFileUri = FileSystem.documentDirectory + fileInfo.name;
      await FileSystem.downloadAsync(uri, tempFileUri);

      // Open the file
      const fileUri = Platform.OS === 'ios' ? `file://${tempFileUri}` : tempFileUri;
      const supported = await Linking.canOpenURL(fileUri);
      if (supported) {
        await Linking.openURL(fileUri);
      } else {
        Alert.alert('Error', 'No application found to open this file.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while trying to open the document.');
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={{ borderWidth: 2, borderColor: '#fff', padding: 10, borderRadius: 5 }}
        onPress={handlePress}
      >
        <Text style={{  fontSize: 16 }}>{name}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DocViewer;