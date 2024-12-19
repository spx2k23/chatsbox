import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, Platform ,Dimensions} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSQLiteContext } from 'expo-sqlite';
import DateOfBirth from '../components/Profile/DateOfBirth';
import { Button } from 'react-native-elements';

const { width } = Dimensions.get('window');
const scale = width / 375; // 375 is the baseline width (iPhone 6)

const scaleFont = (size) => size * scale;
const scaleSize = (size) => size * scale;

const Profile = ({ navigation }) => {
    const db = useSQLiteContext();

    const[isEditing,setIsEditing]=useState(false);
    const [name, setName] = useState();
    const [companyName, setCompanyName] = useState("");
    const [bio, setBio] = useState("This is your bio !");
    const [role,setRole]=useState('')
    const [email, setEmail] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date(2002, 4, 1));

    useEffect(() => {
        fetchUser ();
    }, []);

    const fetchUser  = async () => {
        const user = await db.getFirstAsync('SELECT * FROM user');
        setName(user.name);
        setProfilePic(user.profilePicture);
        setEmail(user.email);
        setRole('Junior Developer');
        setCompanyName('Company Name')
    }

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

    const handleEdit = () => setIsEditing(true);
    const handleSave = () => {
        if (bio.length > 150) {
            alert("Bio cannot exceed 150 characters.");
        } else {
            setIsEditing(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Profile Picture */}
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
  
  
  
            <TouchableOpacity onPress={handleEdit} style={styles.editIcon}>
                   {/* <Text style={styles.edit}>{'Edit'}</Text> */}
                    <MaterialIcons name={"edit"} size={24} color="#6200EE" />
                    
                </TouchableOpacity>

           <Text style={styles.lable}> 
            Name :</Text>
            <View style={styles.inputContainer}>
            
                {isEditing? (
                    <TextInput
                        style={styles.inputField}
                        value={name}
                        onChangeText={setName}
                        placeholder="Your Name"
                    />
                ) : (
                    <Text style={[styles.textField,styles.name]}>{name}</Text>
                )}
               
            </View>
            <Text style={styles.lable}> Role :</Text>
            <View style={styles.inputContainer}>
            
                {isEditing? (
                    <TextInput
                        style={[styles.inputField,{fontSize:16}]}
                        value={role}
                        onChangeText={setRole}
                        placeholder="Your Name"
                    />
                ) : (
                    <Text style={[styles.textField,styles.role]}>{role}</Text>
                )}
               
            </View>

            <Text style={styles.lable}>Date Of Birth :</Text>
            <DateOfBirth isEditing={isEditing} setIsEditing={setIsEditing} selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
            <Text style={[styles.lable,styles.bio]}>Bio :</Text>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.inputContainer}>
                    {isEditing ? (
                        <TextInput
                            style={styles.textArea}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Your bio"
                            multiline
                            numberOfLines={4}
                        />
                    ) : (
                        <Text style={[styles.textField,styles.bio]}>{bio}</Text>
                    )}
                </View>
            </ScrollView>
            
            {isEditing && (
  <View style={styles.btncontainer}>
    <Button 
      onPress={handleSave} 
      buttonStyle={styles.btnsave} 
      title="Save" 
    />
    <Button 
      onPress={() => setIsEditing(false)} 
      buttonStyle={styles.btncancel} 
      title="Cancel" 
    />
  </View>
)}

            {/* Footer */}
            <View style={styles.footerContainer}>
                <View style={styles.line}></View>
                <Text style={styles.footerText}>Powered by Sprexcel</Text>
            </View>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: '#6200EE',
        position: 'absolute',
        top: 0,
        zIndex: 1,
        height: 100,
        width: '120%',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: scaleSize(20), // Scaled padding for consistency
        backgroundColor: '#f4f7fa',
    },
    profileContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: scaleSize(20), // Scaled margin
        width: '70%',
        marginLeft:50
    },
    inputField: {
        width:200,
        fontSize: scaleFont(18), // Scaled font size
        borderBottomWidth: scaleSize(2),
        borderBottomColor: '#6200EE',
        flex: 1,
        marginRight: scaleSize(10),
        paddingHorizontal: scaleSize(10),
        paddingVertical: scaleSize(5),
        textAlign: 'center',
    },
    textField: {
        textAlign: 'center',
        flex: 1,
        // borderBottomWidth: scaleSize(2),
        // borderBottomColor: '#6200EE',
        marginTop: scaleSize(10),
        paddingBottom: scaleSize(2),
    },
    editIcon: {
        padding: scaleSize(5),
        alignSelf: 'flex-end',
        marginRight: scaleSize(20),
        marginTop: scaleSize(10),
        flexDirection: 'row',
    },
    email: {
        color: '#6B6B6B',
        fontSize: scaleFont(16),
        marginTop: scaleSize(10),
    },
    scrollViewContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    textArea: {
        fontSize: scaleFont(14),
        color: '#333',
        marginTop: scaleSize(10),
        textAlign: 'center',
        flex: 1,
        borderWidth: scaleSize(1),
        borderColor: '#6200EE',
        padding: scaleSize(10),
        borderRadius: scaleSize(10),
        backgroundColor: '#f9f9f9',
        lineHeight: scaleSize(20),
        height: scaleSize(90),
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: scaleSize(10),
    },
    line: {
        borderBottomWidth: scaleSize(1),
        borderBottomColor: '#6200EE',
        width: '80%',
        marginBottom: scaleSize(10),
    },
    footerText: {
        fontSize: scaleFont(14),
        color: '#6200EE',
        textAlign: 'center',
        marginBottom: scaleSize(10),
    },
    role: {
        margin: Platform.OS === 'ios' ? scaleSize(4) : 0,
        fontSize:16
    },
    company: {
        fontWeight: 'bold',
        color: '#6200EE',

        fontSize: scaleFont(15),
        margin: Platform.OS === 'ios' ? scaleSize(8) : scaleSize(5),
    },
    name: {
        fontSize: scaleFont(24),
        fontWeight: '300',
    },
    bio: {
        marginTop: scaleSize(10),
        paddingBottom:10
    },
    lable: {
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        color: '#6200EE',
        marginTop: scaleSize(5),
        marginLeft:30
    },
    btncontainer: {
        flexDirection: 'row',
        height: scaleSize(100), // Scaled height for button container
        marginLeft:90
    },
    btnsave: {
        width: scaleSize(80),
        fontSize: scaleFont(16),
        color: '#fff',
        backgroundColor: '#6200EE',
    },
    btncancel: {
        backgroundColor: '#B0BEC5',
        width: scaleSize(80),
        color: '#fff',
        fontSize: scaleFont(16),
        marginLeft: scaleSize(15),
    },
    profileedit:{
        position: 'absolute',
        top: scaleSize(30),  // Adjust based on your preference (closer to the top)
        zIndex: 10,  
       
    }
});