import { StyleSheet, View,Dimensions,TouchableOpacity,Text,Image,Platform } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';


const { width } = Dimensions.get('window');
const scale = width / 375;
const scaleSize = (size) => size * scale;
const scaleFont = (size) => size * scale;


const ProfilePic=({profilePic,isEditing ,email,companyName})=>{

    const pickImage = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
          alert("Permission to access camera roll is required!");
          return;
        }
      
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: [ImagePicker.CameraType.front],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      
        if (!pickerResult.cancelled && pickerResult.uri) {
          setProfilePic(pickerResult.uri);
          console.log(pickerResult.uri);
        }
      };

    return(
<>
<View style={styles.backdrop}></View>
            <View style={styles.profileContainer}>
                <TouchableOpacity onPress={isEditing?pickImage:null} style={styles.profilePicWrapper} activeOpacity={isEditing?0.2:1}>
                { isEditing&&<View style={styles.profileedit}><MaterialIcons name='camera-alt' size={54} color="#fff" /></View>}
                    {profilePic ? (
                        <Image source={{ uri: `data:image/jpeg;base64,${profilePic}`}} style={styles.profileImg} />
                    ) : (
                        <MaterialIcons name="account-circle" size={150} color="#6200EE" style={styles.profileImg} />
                    )}
                </TouchableOpacity>
                <Text style={styles.email}>{email}</Text>
                <Text style={styles.company}>{companyName}</Text>
               
            </View>
</>
    );
}

export default ProfilePic;

const styles=StyleSheet.create({
    backdrop: {
        backgroundColor: '#6200EE',
        position: 'absolute',
        top: 0,
        zIndex: 1,
        height: 100,
        width: '120%',
    },
   
    profileContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        marginBottom:50
    },
    profilePicWrapper: {
        borderRadius: scaleSize(85), // Scaled profile pic
        borderWidth: scaleSize(2),
        borderColor: '#fff',
        overflow: 'hidden',
        position: 'relative',  // Ensures that the profile edit icon can be positioned over the profile picture
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    profileImg: {
        width: scaleSize(100),
        height: scaleSize(100),
        borderRadius: scaleSize(75),
    },
    profileedit:{
        position: 'absolute',
        top: scaleSize(30),  // Adjust based on your preference (closer to the top)
        zIndex: 10,  
       
    },
    email: {
        color: '#6B6B6B',
        fontSize: scaleFont(16),
        marginTop: scaleSize(10),
    },
    company: {
        fontWeight: 'bold',
        color: '#6200EE',
        fontSize: scaleFont(15),
        margin: Platform.OS === 'ios' ? scaleSize(8) : scaleSize(5),
    },
});