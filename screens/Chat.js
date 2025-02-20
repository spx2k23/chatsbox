import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Platform, TextInput } from "react-native";
import { Text, View, StyleSheet, TouchableOpacity ,Image} from "react-native";
import ProfileModal from "../components/UserBox/ProfileModal";


const isIosPlatfom=Platform.OS==='ios';
const Chat = ({ route }) => {
  const navigation = useNavigation();
  const data = route.params;
  const [profilemodel,setprofilemodel]=useState(false);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setprofilemodel(true)} >
        <Image source={{ uri: `data:image/jpeg;base64,${data.image}`}} style={styles.profileImg} />
        </TouchableOpacity>
        <Text style={styles.nameText}>{data.name}</Text>
      </View>
      {profilemodel&&<ProfileModal setModalVisible={setprofilemodel} modalVisible={profilemodel} isFriend={true} image={data.image} firstName={data.name} email={data.datas.email} role={data.datas.role} bio={data.datas.bio}/>}

      <View style={styles.inputContainer}>
        <View style={styles.inputBox}>
          <TextInput placeholder="Message"/>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop:isIosPlatfom?60:30,
    paddingBottom:10,
    position:'absolute',
    zIndex:1,
    top:0,
    left:0,
    width:'112%'
  },
 
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'#6200EE'
  },
  profileImg:{
    width: 40,
    height: 40,
    borderRadius: 20, 
    marginHorizontal:20,
  },
  inputContainer:{
    position:'absolute',
    zIndex:1,
    bottom:0,
    width:'100%',
    paddingBottom:isIosPlatfom?30:10,
    paddingLeft:isIosPlatfom?5:0,
  },
  inputBox:{
    borderWidth:1,
    borderRadius:20,
    margin:10,
    height:isIosPlatfom?'100%':'70%',
    width:isIosPlatfom?'105%':'105%',
  }
});

export default Chat;
