import { View, StyleSheet,  Text, Image, Dimensions,  TouchableOpacity, } from 'react-native';
import { Video } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import VideoPlayer from './AnnouncementInputBoxComponents/VideoPlayer';
import DocViewer from './AnnouncementInputBoxComponents/DocViewer';
import AudioPlayer from './AnnouncementInputBoxComponents/AudioPlayer';


const AnnouncementCard=({group})=>{
    return(
       <>
       <Image source={{ uri:'https://i.etsystatic.com/40954129/r/il/3283f5/5550043462/il_570xN.5550043462_quo7.jpg' }} style={styles.profilePic} />

        {group.map((item) => (
         <View key={item.id} style={styles.itemContainer}>
          {item.type === 'text' &&(
            <Text style={styles.messageText}>{item.content}</Text>
          )}
          {item.type === 'image' && item.uri && (
            <Image source={{ uri: item.uri }} style={styles.image} />
          )}
          {item.type === 'video' && item.uri && (
            <VideoPlayer item={item}/>
          )}
          {item.type==='document'&& item.uri &&(
            <DocViewer name={item.name} uri={item.uri}/>
          )}
          {item.type==='audio'&&item.uri&&(
            <AudioPlayer uri={item.uri}/>
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
  </View>

  <TouchableOpacity style={styles.star}>
    <MaterialIcons size={24} color={'grey'} name="star-border" />
  </TouchableOpacity>
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
      },
      messageText: {
        fontSize: 16,
        color: '#333',
      },
      profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        marginBottom:8,
        borderWidth:.2
      },
      image: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        borderRadius:25
      },
      video: {
        width: '100%',
        height: 200,
      },
      btnscontainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        width: '100%',
        paddingLeft:5  
      },
      leftIcons: {
        flexDirection: 'row', 
        flex: 1, 
        justifyContent: 'flex-start',
        gap:20,
       
      },
      star: {
        marginLeft: 10, 
      }
  });