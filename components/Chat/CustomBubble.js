import React from 'react';
import { Bubble } from 'react-native-gifted-chat';
import { Text, View } from 'react-native';

const CustomBubble = (props) => {
  const formatTime = (date) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(date).toLocaleTimeString('en-US', options);
  };

  // Check if the message is a document
  const isDocumentMessage = props.currentMessage.document !== undefined;

  return (
    <Bubble
      {...props}
      wrapperStyle={{
        left:  { backgroundColor: '#A3C8E7', paddingVertical: 6, paddingHorizontal: 10 },
        right:  { backgroundColor: '#6200EE', paddingVertical: 6, paddingHorizontal: 10 },
      }}
      
      renderTime={(props) => (
        <Text
          style={{
            fontSize: 12,
            color: '#fff',
            textAlign: 'right',
            paddingBottom:2,
            paddingRight:2
          }}
        >
          {formatTime(props.currentMessage.createdAt)}
        </Text>
      )}
    />
  );
};

export default CustomBubble;
