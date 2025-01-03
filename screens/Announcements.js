import React, { useState } from 'react';
import { View, FlatList, StyleSheet,TouchableWithoutFeedback,Keyboard } from 'react-native';
import AnnouncementsInputBox from '../components/Announcements/AnnouncementsInputBox';
import AnnouncementCard from '../components/Announcements/AnnouncementCard';
import AnnouncementInputContainer from '../components/Announcements/AnnouncementInputBoxComponents/AnnouncementInputContainer';

const Announcements = () => {
  const [announcement, setAnnouncement] = useState([]);
  const [showContainer, setShowContainer] = useState(false);
  const [tempData, setTempData] = useState([]); // This will store the content blocks

  const renderMessage = ({ item }) => (
    <AnnouncementCard announcement={item} />
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={{ flex: 1 }}>
      {/* Announcement Input Container will only show if 'showContainer' is true */}
      {showContainer && (
        <AnnouncementInputContainer 
          setShowContainer={setShowContainer} 
          tempData={tempData} 
          setTempData={setTempData}
        />
      )}

      <FlatList
        data={announcement}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        inverted
        style={styles.flatList}
        contentContainerStyle={{ alignItems: 'center' }}
      />
      
      {/* Announcement Input Box */}
      <AnnouncementsInputBox 
        setAnnouncement={setAnnouncement} 
        announcement={announcement} 
        showContainer={showContainer} 
        setShowContainer={setShowContainer}
        tempData={tempData} 
        setTempData={setTempData} 
      />
    </View>
    </TouchableWithoutFeedback >
  );
};

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
});

export default Announcements;
