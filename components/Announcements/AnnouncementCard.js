import { View, StyleSheet,Text,Dimensions } from 'react-native';

const AnnouncementCard=({announcement})=>{
    return(
        <View style={styles.card}>
            <Text style={styles.announcementtext}>{announcement.text} </Text>
        </View>
    );
}

export default AnnouncementCard;
const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    card:{
        width:windowWidth*.9,
       borderColor:'#000',
       borderWidth:.5,
       borderRadius:10,
        marginBottom:15,
        padding:5
    },
    announcementtext:{
        marginLeft:10
    }
  });