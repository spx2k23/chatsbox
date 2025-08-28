import { Text, View, StyleSheet, TouchableOpacity, Image  } from "react-native";
import { Platform, TextInput, KeyboardAvoidingView, Keyboard } from "react-native";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from 'expo-document-picker';
import { useState ,useRef} from "react";
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import theme from "../config/theme";
import GroupChatContentBox from "../components/GroupChat/GroupChatContentBox";
import {ms,s,vs} from 'react-native-size-matters';
const isIosPlatform = Platform.OS === 'ios';

const GroupChat=()=>{

    const data={
        image:'https://img.freepik.com/free-vector/happy-green-cartoon-dragon-smiling_1308-138462.jpg?semt=ais_hybrid',
        name:'Sprexcel'
    }
    const currentUserID = 'dbdkjdlk';
    const navigation = useNavigation();
    const [messages, setMessages] = useState([
        {
          _id: '1',
          type: 'text',
          text: 'Hey there!',
          createdAt: new Date(),
          user: {
            _id: currentUserID,
            name: 'Sprexcel',
            avatar: 'https://img.freepik.com/free-vector/happy-green-cartoon-dragon-smiling_1308-138462.jpg?semt=ais_hybrid',
          },
        },
        {
          _id: '2',
          type: 'text',
          text: 'Hello!',
          createdAt: new Date(),
          user: {
            _id: 'otherUser',
            name: 'John Doe',
            avatar: 'https://img.freepik.com/free-vector/cute-pink-dragon-cartoon-character-standing-isolated_1308-140080.jpg?semt=ais_hybrid',
          },
        },
        {
          _id: '3',
          type: 'text',
          text: 'How are you?',
          createdAt: new Date(),
          user: {
            _id: currentUserID,
            name: 'Sprexcel',
            avatar: 'https://img.freepik.com/free-vector/happy-green-cartoon-dragon-smiling_1308-138462.jpg?semt=ais_hybrid',
          },
        },
        {
            _id: '2',
            type: 'text',
            text: 'there',
            createdAt: new Date(),
            user: {
              _id: 'otherUser2',
              name: 'Kavin',
              avatar: 'https://img.freepik.com/free-vector/happy-blue-cartoon-dragon-smiling_1308-146653.jpg',
            },
          },
          {
            _id: '2',
            type: 'text',
            text: 'Hello!',
            createdAt: new Date(),
            user: {
              _id: 'otherUser2',
              name: 'Kavin',
              avatar: 'https://img.freepik.com/free-vector/happy-blue-cartoon-dragon-smiling_1308-146653.jpg',
            },
          },
      ]);
    const [inputHeight, setInputHeight] = useState(40); // Initial height for TextInput
    const maxInputHeight = 120; // Maximum height for TextInput
    const [textMessage, setTextMessage] = useState('');

    const [imagePickerPermission, setImagePickerPermission] = useState(false);
    const [recording, setRecording] = useState(null);
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const isHoldingRef = useRef(false); // Use a ref for isHolding
    let holdTimeout;
  
    const recordingSettings = Audio.RecordingOptionsPresets.HIGH_QUALITY; // Use preset for simplicity
  
    async function prepareRecording() {
      try {
        // Check if permissions are granted
        if (!permissionResponse || permissionResponse.status !== 'granted') {
          console.log('Requesting permissions...');
          const { status } = await requestPermission();
          if (status !== 'granted') {
            console.error('Permission not granted');
            return false;
          }
        }
  
        // Set audio mode for recording
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          playThroughEarpieceAndroid: false,
          staysActiveInBackground: true,
        });
  
        console.log('Recording prepared successfully');
        return true;
      } catch (err) {
        console.error('Failed to prepare recording', err);
        return false;
      }
    }
   
    async function startRecording() {
      try {
        // Prepare the recorder
        const isPrepared = await prepareRecording();
        if (!isPrepared) {
          console.error('Recording preparation failed');
          return;
        }
  
        // Stop any existing recording
        if (recording) {
          console.log('Stopping previous recording...');
          await recording.stopAndUnloadAsync();
          setRecording(null);
        }
  
        // Start a new recording
        console.log('Starting new recording...');
        const { recording: newRecording } = await Audio.Recording.createAsync(
          recordingSettings
        );
        setRecording(newRecording);
        console.log('Recording started successfully');
      } catch (err) {
        console.error('Failed to start recording', err);
      }
    }
  
    async function stopRecording() {
      try {
        if (recording) {
          console.log('Stopping recording...');
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();
          setMessages([
            {
              _id: currentUserID + Date.now().toString(),
              type: 'audio',
              uri: uri,
              createdAt: new Date(),
              user: {
                _id: currentUserID,
                name: data.name,
                avatar: data.image,
              },
            },
            ...messages,
          ]);
          setRecording(null);
          console.log('Recording stopped and saved:', uri);
  
          // Reset audio mode after recording
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
            playThroughEarpieceAndroid: false,
            staysActiveInBackground: false,
          });
        }
      } catch (err) {
        console.error('Failed to stop recording', err);
      }
    }
  
    const handleMicPressIn = () => {
      console.log("Mic pressed...");
      isHoldingRef.current = true; // Update the ref
  
      // Set a timeout to start recording after 1 second
      holdTimeout = setTimeout(() => {
        if (isHoldingRef.current) {
          console.log("Hold time exceeded 1 second");
          startRecording();
        }
      }, 300); // 1 second delay
    };
  
    const handleMicPressOut = () => {
      console.log("Mic released...");
      isHoldingRef.current = false; // Update the ref
  
      // Clear the timeout if the hold duration is less than 1 second
      clearTimeout(holdTimeout);
  
      // Stop the recording if it has already started
      if (recording) {
        console.log("Stopping recording due to release...");
        stopRecording();
      }
    };
  
    const handleMediaSelect = async () => {
      if (!imagePickerPermission) {
        Alert.alert(
          'Permission Required',
          'This app needs access to your photos and videos.',
          [
            {
              text: 'Grant Permission',
              onPress: async () => {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status === 'granted') {
                  setImagePickerPermission(true);
                  openMediaPicker(); // Open media picker after permission is granted
                } else {
                  Alert.alert('Permission Denied', 'We need access to your photo library to select media.');
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
        openMediaPicker(); // Open media picker directly if permission is already granted
      }
    };
  
    const openMediaPicker = async () => {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images','videos'], // Allow both images and videos
          quality: 1,
          allowsEditing: true,
        });
        if (!result.canceled && result.assets?.[0]?.uri) {
          const asset = result.assets[0];
          // Handle based on the type of media selected
          if (asset.type === 'video') {
            setMessages([
              {
                _id: currentUserID + Date.now().toString(),
                type: 'video',
                uri: asset.uri,
                createdAt: new Date(),
                user: {
                  _id: currentUserID,
                  name: data.name,
                  avatar: data.image,
                },
              },
              ...messages,
            ]);
          } else if (asset.type === 'image') {
            setMessages([
              {
                _id: currentUserID + Date.now().toString(),
                type: 'image',
                uri: asset.uri,
                createdAt: new Date(),
                user: {
                  _id: currentUserID,
                  name: data.name,
                  avatar: data.image,
                },
              },
              ...messages,
            ]);
          }
        } else {
          console.log('Selection was canceled or failed.');
        }
      } catch (error) {
        console.error('Error opening media picker:', error);
        Alert.alert('Error', 'There was an issue opening the media picker.');
      }
    };


    const handleDocSelect = async () => {
        try {
          const result = await DocumentPicker.getDocumentAsync({
            type: 'application/*', // Pick any file type
          });
    
          if (!result.canceled && result.assets.length > 0) {
            const doc = result.assets[0];
            setMessages([
              {
                _id: currentUserID + Date.now().toString(),
                type: 'document',
                documentData: doc,
                createdAt: new Date(),
                user: {
                  _id: currentUserID,
                  name: data.name,
                  avatar: data.image,
                },
              },
              ...messages,
            ]);
          }
        } catch (error) {
          console.error('Error picking document:', error);
        }
      };
    
      const handleTextSend = () => {
        const temp = {
          _id: currentUserID + Date.now().toString(),
          type: 'text',
          text: textMessage,
          createdAt: new Date(),
          user: {
            _id: currentUserID,
            name: data.name,
            avatar: data.image,
          },
        };
        setMessages((prevMessages) => [temp, ...prevMessages]);
        setTextMessage('');
        setInputHeight(40); // Reset height to initial value
        Keyboard.dismiss();
    
      };


    return(
        <KeyboardAvoidingView
        behavior={ isIosPlatform?"padding" :null}
        keyboardVerticalOffset={isIosPlatform ? 0 : 40}
        style={{ flex: 1 ,backgroundColor:'#fff',}}
        
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={24} />
            </TouchableOpacity>
            <TouchableOpacity >
              <Image
                // source={{ uri: `data:image/jpeg;base64,${data.image}` }}
                source={{uri:data.image}}
                style={styles.profileImg}
              />
            </TouchableOpacity>
            <Text style={styles.nameText} numberOfLines={1}>{data.name}</Text>
            <View style={styles.headerIcons}>
                <MaterialCommunityIcons  name="phone-outline" size={ms(22)} color={'grey'}/>
                <MaterialCommunityIcons  name="video-plus-outline" size={ms(22)} color={'grey'}/>
                <MaterialCommunityIcons  name="dots-vertical" size={ms(22)} color={'grey'}/>
            </View>
          </View>
  
       
            <GroupChatContentBox messages={messages} currentUserID={currentUserID}/>

         
          {/* Input Container */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputBox, { minHeight: inputHeight }]}>
              <TextInput
                placeholder="Message..."
                style={[
                  styles.textInput,
                  { maxHeight: maxInputHeight }, // Limit the maximum height
                ]}
                multiline
                numberOfLines={5}
                onContentSizeChange={(event) => {
                  const contentHeight = event.nativeEvent.contentSize.height;
                  setInputHeight(Math.min(maxInputHeight, contentHeight)); // Update height dynamically
                }}
                onChangeText={(text) => setTextMessage(text)}
                value={textMessage}
              />
              <View style={styles.iconBox}>
                {textMessage.length <= 0 && (
                  <>
                    <TouchableOpacity onPress={handleDocSelect}>
                      <MaterialCommunityIcons
                        name="file-upload-outline"
                        size={ms(22)}
                        color="grey"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleMediaSelect}>
                      <Ionicons name="image-outline" size={ms(22)} color="grey" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{}}onPressIn={handleMicPressIn} onPressOut={handleMicPressOut}>
                      <Ionicons name="mic-outline" size={recording?ms(30):ms(22)} color="grey" />
                    </TouchableOpacity>
                  </>
                )}
                {textMessage.length > 0 && (
                  <TouchableOpacity onPress={handleTextSend}>
                    <MaterialCommunityIcons name="send-outline" size={24} color={theme.colors.basicColor} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
}
export default GroupChat;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingBottom:70
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      paddingTop: isIosPlatform ? 60 : 30,
      paddingBottom: 10,
      width: '100%',
      paddingHorizontal: 10,
      backgroundColor: '#fff',
    },
    headerIcons:{
        flexDirection:'row',
         gap:s(25),
         zIndex:1,
        position:'absolute',
        right:10,
        alignItems:'center',
        paddingTop: isIosPlatform ? 60 : 30,
       
    },
    nameText: {
      fontSize: ms(18),
      fontWeight: 'bold',
      color: theme.colors.basicColor,
      marginLeft: 10,
      width:'40%',
    },
    profileImg: {
      width: ms(30),
      height: ms(30),
      borderRadius: ms(15),
      marginHorizontal: 10,
    },
    inputContainer: {
      flex: isIosPlatform ? 0.5 : 0, // Adjust flex for input container
      width: '100%',
      paddingHorizontal:s(5),
      backgroundColor: 'transparent',
      minHeight:'2%',
      marginBottom:isIosPlatform?0:20,
      position:'absolute',
      bottom:isIosPlatform?40:0,
      zIndex:10
    
    },
    inputBox: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: s(10),
      paddingVertical: 2,
      backgroundColor: '#fff',
    },
    textInput: {
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 8,
      fontSize: ms(14),
      textAlignVertical: 'top',
    },
    iconBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap:5
    },
  });