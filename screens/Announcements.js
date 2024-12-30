import React, { useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import AnnouncementsInputBox from '../components/Announcements/AnnouncementsInputBox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Announcements = () => {
  // Create a ref for the KeyboardAwareScrollView to programmatically scroll
  const scrollViewRef = useRef(null);

  return (
    <KeyboardAwareScrollView
      ref={scrollViewRef} // Set ref for scroll view
      contentContainerStyle={styles.container}
      enableOnAndroid={true}  // Enable on Android
      extraHeight={Platform.OS === 'ios' ? 115 : 200} // Adjust height for keyboard
      keyboardShouldPersistTaps="handled"
      innerRef={(ref) => { scrollViewRef.current = ref }} // Keep the reference to the scroll view
    >
      <AnnouncementsInputBox scrollViewRef={scrollViewRef} />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure the container takes up all available space
    paddingBottom: 20, // Padding to give space at the bottom
  },
});

export default Announcements;
