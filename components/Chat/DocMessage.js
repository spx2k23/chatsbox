import * as FileSystem from 'expo-file-system';
import { StyleSheet } from 'react-native';
import { Linking, View, TouchableOpacity, Text } from 'react-native';

const DocMessage = ({ currentMessage }) => {
  return (
    <View >
      <TouchableOpacity
        style={{ borderWidth:2,borderColor:'#fff', padding: 10, borderRadius: 5 }}
        onPress={async () => {
          const fileUri = currentMessage.document;
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          const { uri: tempFileUri } = await FileSystem.downloadAsync(fileUri, FileSystem.documentDirectory + fileInfo.name);

          if (Platform.OS === 'ios') {
            Linking.openURL(`file://${tempFileUri}`);
          } else {
            Linking.openURL(tempFileUri);
          }
        }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>{currentMessage.text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DocMessage;