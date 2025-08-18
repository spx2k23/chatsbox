import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity, } from 'react-native';
import { Video } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import VideoPlayer from './AnnouncementInputBoxComponents/VideoPlayer';
import DocViewer from './AnnouncementInputBoxComponents/DocViewer';
import AudioPlayer from './AnnouncementInputBoxComponents/AudioPlayer';
import Vote from './AnnouncementInputBoxComponents/Vote/Vote';

const AnnouncementCard = ({ group }) => {

  const date = new Date(group[0].date);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'
  // Format the time components to ensure leading zeros
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;


  return (
    <>
      <View style={styles.profileAndtime}>
        <Image source={{ uri: 'https://i.etsystatic.com/40954129/r/il/3283f5/5550043462/il_570xN.5550043462_quo7.jpg' }} style={styles.profilePic} />
        <Text style={styles.name}>{group[0].name}</Text>
      </View>
      {group.map((item) => (
        <View key={item.id} style={styles.itemContainer}>
          {item.type === 'text' && (
            <Text style={styles.messageText}>{item.content}</Text>
          )}
          {item.type === 'image' && item.uri && (
            <Image source={{ uri: item.uri }} style={styles.image} />
          )}
          {item.type === 'video' && item.uri && (
            <VideoPlayer item={item} />
          )}
          {item.type === 'document' && item.uri && (
            <DocViewer name={item.name} uri={item.uri} />
          )}
          {item.type === 'audio' && item.uri && (
            <AudioPlayer uri={item.uri} />
          )}
          {
            item.type === 'vote' && (
              <Vote item={item} />
            )}
        </View>
      ))}

      <View style={styles.btnscontainer}>
        <View style={styles.leftIcons}>
          <TouchableOpacity>
            <MaterialIcons size={24} color={'grey'} name="thumb-up-off-alt" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons size={24} color={'grey'} name="send" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.star}>
            <MaterialIcons size={24} color={'grey'} name="bookmark-border" />
          </TouchableOpacity>
        </View>
        <Text style={styles.time}>{`${hours} : ${formattedMinutes} ${ampm}`}</Text>
      </View>
    </>
  );
}

export default AnnouncementCard;
const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 15,
    padding: 10,
    marginLeft: 15,
    paddingBottom: 5
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 8,
    borderWidth: .2,
  },
  name: {
    fontSize: 18,
    fontWeight: '500'
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'stretch',
    borderRadius: 10
  },
  video: {
    width: '100%',
    height: 200,
  },
  btnscontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 5
  },
  leftIcons: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    gap: 20,

  },
  star: {
    // marginLeft: 10, 
  },
  time: {
    color: 'grey',

  },
  profileAndtime: {
    flexDirection: 'row', // Align children horizontally (left to right)
    justifyContent: 'flex-start', // Add space between the image and the text
    alignItems: 'center'
  }
});
