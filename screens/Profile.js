import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const Profile = ({ navigation }) => {
    // State to manage editing modes
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const[isEditingCompanyName,setIsEditingcompanyName]=useState(false);

    // State to store the user data
    const [name, setName] = useState("Your Name");
    const[companyname,setcompanyName]=useState("Company Name")
    const [bio, setBio] = useState("This is your bio. Add details about yourself here!");
    const [profilePic, setProfilePic] = useState(null); // No profile pic initially

    // Request permissions and open image picker
    const pickImage = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,  
            aspect: [4, 3],
            quality: 1,           
        });

        if (!pickerResult.cancelled) {
            setProfilePic(pickerResult.uri); // Set the selected image as profile picture
        }
    };

    const handleEditName = () => {
        setIsEditingName(true);
    };
    const handleEditcompanyName = () => {
        setIsEditingcompanyName(true);
    };
    const handleSaveName = () => {
        setIsEditingName(false);
    };
    const handleSavecompanyName = () => {
        setIsEditingcompanyName(false);
    };
    const handleEditBio = () => {
        setIsEditingBio(true);
    };

    const handleSaveBio = () => {
        if (bio.length > 150) {
            alert("Bio cannot exceed 150 characters.");
        } else {
            setIsEditingBio(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Profile Picture */}
            <View style={styles.profileContainer}>
                <TouchableOpacity onPress={pickImage}>
                    {/* Display profile picture or default icon */}
                    {profilePic ? (
                        <Image source={{ uri: profilePic }} style={styles.profileImg} />
                    ) : (
                        <MaterialIcons name="account-circle" size={150} color="#6200EE" style={styles.profileImg} />
                    )}
                </TouchableOpacity>
                <Text style={styles.profileText}>Click to change profile picture</Text>
            </View>

            {/* Editable Name */}
            <View style={styles.nameContainer}>
                {isEditingName ? (
                    <TextInput
                        style={styles.nameInput}
                        value={name}
                        onChangeText={setName}
                        placeholder='Your Name'
                    />
                ) : (
                    <Text style={styles.name}>{name}</Text>
                )}

                <TouchableOpacity onPress={isEditingName ? handleSaveName : handleEditName}>
                    <MaterialIcons
                        name={isEditingName ? "save" : "edit"}
                        size={24}
                        color="#6200EE"
                    />
                </TouchableOpacity>
            </View>
            
            <Text style={styles.mail}> {"yourmail@gmail.com"}</Text>

            {/*gfdjgbhsindfsgnjngjdnf */}
            <View style={styles.companynameContainer}>
                {isEditingCompanyName ? (
                    <TextInput
                        style={styles.companynameInput}
                        value={companyname}
                        onChangeText={setcompanyName}
                        placeholder='Your Company Name'
                    />
                ) : (
                    <Text style={styles.companyname}>{companyname}</Text>
                )}

                <TouchableOpacity onPress={isEditingCompanyName ? handleSavecompanyName : handleEditcompanyName}>
                    <MaterialIcons
                        name={isEditingCompanyName ? "save" : "edit"}
                        size={24}
                        color="#6200EE"
                    />
                </TouchableOpacity>
            </View>

            {/* Bio and Edit Pen Icon */}
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.bioContainer}>
                    {isEditingBio ? (
                        <TextInput
                            style={styles.bioInput}
                            value={bio}
                            onChangeText={setBio}
                            placeholder='Bio'
                            multiline
                            numberOfLines={4}
                        />
                    ) : (
                        <Text style={styles.bio}>{bio}</Text>
                    )}

                    <TouchableOpacity onPress={isEditingBio ? handleSaveBio : handleEditBio} style={styles.penIcon}>
                        <MaterialIcons
                            name={isEditingBio ? "save" : "edit"}
                            size={24}
                            color="#6200EE"
                        />
                    </TouchableOpacity>
                </View>

               <View style={styles.footerContainer}>
                <View style={styles.line}></View>
                <Text style={styles.footerText}>Powered by Sprexcel</Text>
            </View>

            </ScrollView>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 20,
        justifyContent: 'center',
    },
    profileImg: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
    },
    profileText: {
        fontSize: 14,
        color: '#6200EE',
        textAlign: 'center',
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        marginTop:30
    },
    name: {
        fontSize: 22,
        color: '#6200EE',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    nameInput: {
        fontSize: 22,
        color: '#6200EE',
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: '#6200EE',
        flex: 1,
        textAlign: 'center',
    },
    companynameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        marginTop:30
    },
    companyname: {
        fontSize: 22,
        color: '#6200EE',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    companynameInput: {
        fontSize: 22,
        color: '#6200EE',
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: '#6200EE',
        flex: 1,
        textAlign: 'center',
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
        width:350
    },
    bioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop:30
    },
    bio: {
        fontSize: 16,
        color: '#6200EE',
        marginBottom: 10,
        textAlign: 'center',
        flex: 1,
    },
    mail:{
        color:'#6200EE',
        fontSize:16
    },
    bioInput: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
        flex: 1,
        borderWidth: 1,
        borderColor: '#6200EE',
        padding: 8,
        borderRadius: 4,
    },
    penIcon: {
        marginLeft: 10,
    },
    info: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
    },
    footerContainer: {
        position:'absolute',
        top:350,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: '#6200EE',
        width: '90%',
        marginBottom: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#6200EE',
        textAlign: 'center',
    },
});
