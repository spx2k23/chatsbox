import React from 'react';
import { Linking, View, TouchableOpacity, Text, Platform, Alert, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DocViewer = ({ uri, name }) => {
  const [isLoading, setIsLoading] = React.useState(false); // State to track loading

  const handlePress = async () => {
    try {
      setIsLoading(true); // Start loading
      const fileInfo = await FileSystem.getInfoAsync(uri);

      if (!fileInfo.exists) {
        Alert.alert('Error', 'File does not exist.');
        setIsLoading(false); // Stop loading
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
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      {/* Card Container */}
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        disabled={isLoading} // Disable button while loading
      >
        {/* Icon */}
        <MaterialCommunityIcons name="file-document-outline" size={30} color="grey" />

        {/* File Name */}
        <Text style={styles.fileName} numberOfLines={1}>
          {name}
        </Text>

        {/* Loading Indicator or Action Icon */}
        {isLoading ? (
          <ActivityIndicator size="small" color="#6200EE" />
        ) : (
          <MaterialCommunityIcons name="download" size={24} color="grey" />
        )}
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    maxWidth: 400,
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'grey',
    marginHorizontal:10,
    maxWidth:'69%'
  },
};

export default DocViewer;