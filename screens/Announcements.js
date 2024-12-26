import { Text, View, StyleSheet } from 'react-native';
import AnnouncementsInputBox from '../components/Announcements/AnnouncementsInputBox';

const Announcements = () => {
  return (
    <View style={styles.container}>
     
      <AnnouncementsInputBox />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // This makes the parent container take up all available space
    justifyContent: 'flex-end', // Align content to the top of the container
   
  },
  
});

export default Announcements;
