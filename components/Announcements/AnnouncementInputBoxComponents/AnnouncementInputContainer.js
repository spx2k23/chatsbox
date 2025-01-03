import { Text,View,StyleSheet ,Dimensions, TouchableOpacity} from "react-native";
import { IconButton } from 'react-native-paper';

const AnnouncementInputContainer=({setShowContainer})=>{
    return(
        <View style={styles.container}>
           <TouchableOpacity onPress={()=>setShowContainer(false)}><Text style={styles.close}>X</Text></TouchableOpacity> 
           <TouchableOpacity >
          <IconButton icon="send" size={24} style={styles.send} iconColor="#6200EE"/>
          </TouchableOpacity>
        </View>
    );
}

export default AnnouncementInputContainer;

const windowWidth = Dimensions.get('window').width;

const styles=StyleSheet.create({
container:{
    backgroundColor:'#fff',
    height:500,
    width:windowWidth*.9,
    alignSelf:'center',
    borderWidth:1,
    borderColor:'#000',
    borderRadius:10,
    bottom:-150
},
close:{
   alignSelf:'flex-end',
   margin:5,
   fontSize:18
},
send:{
    alignSelf:'flex-end',
    bottom:-410
}
});