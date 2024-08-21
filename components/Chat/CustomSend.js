import React from 'react';
import {  Send } from 'react-native-gifted-chat';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CustomSend = (props) => {
  return (
    <Send {...props}>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
        <TouchableOpacity
          onPress={
            () =>{
                props.onSend({ text: props.text }, true); 
            props.text = ''; 
            }
        }
          style={{
            borderRadius: 20,
            padding: 10,
          }}
        >
          {/* <Text >Send</Text> */}
          <MaterialIcons name='send'  style={{ color: '#6200EE', fontWeight: 'bold' }} size={24}/>
        </TouchableOpacity>
      </View>
    </Send>
  );
};

export default CustomSend;