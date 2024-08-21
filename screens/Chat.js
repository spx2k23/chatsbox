import React, { useState, useCallback } from 'react';
import { View,TouchableOpacity,StyleSheet,Text} from 'react-native';
import { GiftedChat, InputToolbar, MessageImage } from 'react-native-gifted-chat';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio} from 'expo-av';
import DocMessage from '../components/Chat/DocMessage';
import TextMessage from '../components/Chat/TextMessage';
import AudioMessage from '../components/Chat/AudioMessage';
import VideoMessage from '../components/Chat/VideoMessage';
import { MaterialIcons } from '@expo/vector-icons';
import CustomBubble from '../components/Chat/CustomBubble';
import CustomSend from '../components/Chat/CustomSend';


const Chat = ({route}) => {
  const user_id=route.params.user_id;
  const name=route.params.name;
  
  
  const [messages, setMessages] = useState([
    {
      _id: 1,
      text: 'Hello! How are you?',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'John Doe',
      },
    },
    {
      _id: 2,
      text: 'I’m doing well, thanks for asking!',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'Jane Smith',
      },
    },
    {
      _id: 3,
      text: 'Have you checked out the new features?',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'John Doe',
      },
    },
    {
      _id: 4,
      text: 'Yes, they look great! I especially like the new chat interface.',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'Jane Smith',
      },
    },
  ]);
  const [recording, setRecording] = useState(null);
  const [soundUri, setSoundUri] = useState(null);
 
  

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, ...messages)
    );
  }, []);

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
      const mediaType = asset.type;
      const uri = asset.uri;

      let newMessage = {
        _id: Math.random().toString(),
        createdAt: new Date(),
        user: { _id: user_id, name: name },
      };

      if (mediaType === 'video') {
        newMessage.video = uri;
      } else if (mediaType === 'image') {
        newMessage.image = uri;
      }

      onSend([newMessage]);
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      const resultData=result.assets[0]
      const text=resultData.name;
      const document=resultData.uri;

      if (!resultData.canceled) {
        const newMessage = {
          _id: Math.random().toString(),
          createdAt: new Date(),
          user: { _id: user_id, name: name },
          text:text,
          document:document, 
        };
        onSend([newMessage]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

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

  const stopRecording = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setSoundUri(uri);

        const newMessage = {
          _id: Math.random().toString(),
          createdAt: new Date(),
          user: { _id: user_id, name:name },
          audio: uri, 
        };
        onSend([newMessage]);

        setRecording(null);
      } catch (err) {
        console.error('Failed to stop recording', err);
      }
    }
  };
  const renderTime = (props) => {
    return (
      <Text
        style={{
          color: props.currentMessage.user._id === user_id ? '#000' : '#007aff',
          fontSize: 12,
          marginLeft: 5,
        }}
      >
        {props.currentMessage.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    );
  };
  const renderMessageImage = (props) => <MessageImage {...props} />;
  const renderMessageVideo = (props) => {
    const { currentMessage } = props;
    return (<VideoMessage currentMessage={currentMessage}/>);
  };
  const renderMessageText = (props) => {
    const { currentMessage } = props;
    if (currentMessage.document) {
      return (<DocMessage currentMessage={currentMessage}/>);
    }
    return <TextMessage currentMessage={currentMessage}/>;
  };

  const renderMessageAudio = (props) => {
    return (
      <View style={{ padding: 10 }} key={Math.random().toString()}>
        <AudioMessage uri={props.currentMessage.audio} />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: user_id }}
        showAvatar={false}
        renderMessageImage={renderMessageImage}
        renderMessageAudio={renderMessageAudio}
        renderMessageText={renderMessageText}
        renderMessageVideo={renderMessageVideo}
        renderBubble={(props) => <CustomBubble {...props} />}
        renderSend={(props) => <CustomSend {...props} />}
        renderTime={renderTime}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{ borderTopColor: '#eee', borderTopWidth: 1 }}
            renderActions={() => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <TouchableOpacity onPress={handlePickMedia} style={styles.cambtn}>
                  <MaterialIcons name="camera-alt" size={24} color="#6200EE" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePickDocument}>
                  <MaterialIcons name="insert-drive-file" size={24} color="#6200EE" />
                </TouchableOpacity>
                <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
                  <MaterialIcons name={recording ? "stop" : "mic"} size={24} color="#6200EE" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
    />
    </View>
  );
};

export default Chat;

const styles =StyleSheet.create({
  cambtn:{
        marginVertical:10,
        marginHorizontal:10
  }
});

