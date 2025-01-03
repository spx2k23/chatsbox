import React, { useState, useEffect, useRef } from 'react';
import { View, Text,  FlatList, KeyboardAvoidingView,  Platform, Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import AnnouncementsInputBox from '../components/Announcements/AnnouncementsInputBox';
import AnnouncementCard from '../components/Announcements/AnnouncementCard';
import AnnouncementInputContainer from '../components/Announcements/AnnouncementInputBoxComponents/AnnouncementInputContainer';

const Announcements = () => {
  const [announcement, setAnnouncement] = useState([]);
  const [showContainer, setShowContainer] = useState(false); 
  
  const renderMessage = ({ item }) => (
    <AnnouncementCard announcement={item}/>
  );

  return (
   
      <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(),setShowContainer(false)}}>
        <View style={{ flex: 1 }}>
          {showContainer&&<AnnouncementInputContainer setShowContainer={setShowContainer}/>}
          <FlatList
            data={announcement}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            inverted
            style={styles.flatList}
            contentContainerStyle={{alignItems:'center'}}
          />

          {/* Input Section */}
        <AnnouncementsInputBox setAnnouncement={setAnnouncement} announcement={announcement} showContainer={showContainer} setShowContainer={setShowContainer}/>
        </View>
      </TouchableWithoutFeedback>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    flex: 1,
    
  },
  
});

export default Announcements;
