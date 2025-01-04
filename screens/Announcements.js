import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableWithoutFeedback, Keyboard, Text, Image, Dimensions, ScrollView, Platform } from 'react-native';
import AnnouncementsInputBox from '../components/Announcements/AnnouncementsInputBox';
import AnnouncementCard from '../components/Announcements/AnnouncementCard';

import AnnouncementInputContainer from '../components/Announcements/AnnouncementInputBoxComponents/AnnouncementInputContainer';

const windowWidth = Dimensions.get('window').width;  // Get full width of the window

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showContainer, setShowContainer] = useState(false);
  const [tempData, setTempData] = useState([]); // This will store the content blocks

  const renderMessage = ({ item: group, index }) => (
    <View style={styles.groupContainer}>
      {/* Render each item in the group */}
     <AnnouncementCard group={group}/>
    </View>
  );

  return (
   
      <View style={styles.container}>
        {/* Announcement Input Container will only show if 'showContainer' is true */}
        {showContainer && (
          <AnnouncementInputContainer 
            setShowContainer={setShowContainer} 
            tempData={tempData} 
            setTempData={setTempData}
            announcements={announcements}
            setAnnouncements={setAnnouncements}
          />
        )}

        {/* FlatList to render announcements */}
        <FlatList
          data={announcements}
          renderItem={renderMessage}
          keyExtractor={(group, index) => `group-${index}`}
          inverted
          style={styles.flatList}
          contentContainerStyle={styles.contentContainer}
          scrollEnabled={true} 
          keyboardShouldPersistTaps="handled" 
        />
        
        {/* Announcement Input Box */}
        <AnnouncementsInputBox 
          showContainer={showContainer} 
          setShowContainer={setShowContainer}
          tempData={tempData} 
          setTempData={setTempData} 
        />
      </View>
 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    
  },
  flatList: {
    flex: 1, // Ensure the FlatList takes available space
    width: windowWidth,  // Ensure FlatList takes up full width of screen
    
  },
  contentContainer: {
    paddingBottom: 20,   // Ensure there is padding at the bottom of the content
    paddingTop: 10,      // Add padding at the top if necessary
    alignItems: 'center',
    zIndex:5 , // Ensure center alignment for better visual consistency
  },
  
  groupContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    width: windowWidth * 0.95, 
    borderWidth:Platform.OS=='android'?.7:.5,
    borderColor:'grey' 
  },
  
});

export default Announcements;
