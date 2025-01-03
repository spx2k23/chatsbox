import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet, Animated, Keyboard } from 'react-native';
import { IconButton } from 'react-native-paper';

const AnnouncementsInputBox = ({ setAnnouncement, announcement,showContainer, setShowContainer}) => {
  const [isRecording, setIsRecording] = useState(false);
  

  

  return (
    <View style={styles.inputContainer}>
     
        <TouchableOpacity onPress={()=>{setShowContainer(true);}} >
          <IconButton icon={isRecording ? 'stop-circle' : 'microphone'} size={24} />
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{setShowContainer(true);}}  >
          <IconButton icon="text-box-plus-outline" size={24} />
        </TouchableOpacity>

       
          
            <TouchableOpacity onPress={()=>{setShowContainer(true);}}  >
              <IconButton icon="image" size={24} />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{setShowContainer(true);}} >
              <IconButton icon="file-document" size={24} />
            </TouchableOpacity>

            {/* Poll Icon */}
            <TouchableOpacity onPress={()=>{setShowContainer(true);}}  >
              <IconButton icon="text" size={24} />
            </TouchableOpacity>
          
    


      
     
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  
  
});

export default AnnouncementsInputBox;
