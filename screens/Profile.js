import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSQLiteContext } from 'expo-sqlite';

const Profile = ({ navigation }) => {

    const db = useSQLiteContext();

    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [isEditingCompanyName, setIsEditingCompanyName] = useState(false);

    const [name, setName] = useState();
    const [companyName, setCompanyName] = useState("Company Name");
    const [bio, setBio] = useState("This is your bio !");
    const [email, setemail] = useState("");
    const [profilePic, setProfilePic] = useState(null);


    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        const user =await db.getFirstAsync('SELECT * FROM user');
        setName(user.name);
        setProfilePic(user.profilePicture);
        setemail(user.email);
    }


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
            setProfilePic(pickerResult.uri);
        }
    };

    const handleEditName = () => setIsEditingName(true);
    const handleSaveName = () => setIsEditingName(false);
    const handleEditCompanyName = () => setIsEditingCompanyName(true);
    const handleSaveCompanyName = () => setIsEditingCompanyName(false);
    const handleEditBio = () => setIsEditingBio(true);
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
                <TouchableOpacity onPress={pickImage} style={styles.profilePicWrapper}>
                    {profilePic ? (
                        <Image source={{ uri: `data:image/jpeg;base64,${profilePic}` }} style={styles.profileImg} />
                    ) : (
                        <MaterialIcons name="account-circle" size={150} color="#6200EE" style={styles.profileImg} />
                    )}
                </TouchableOpacity>
                <Text style={styles.profileText}>Tap to change profile picture</Text>
                <Text style={styles.email}>{email}</Text>
            </View>

            {/* Editable Name */}
            <View style={styles.inputContainer}>
                {isEditingName ? (
                    <TextInput
                        style={[styles.inputField,styles.name]}
                        value={name}
                        onChangeText={setName}
                        placeholder="Your Name"
                    />
                ) : (
                    <Text style={[styles.textField,styles.name]}>{name}</Text>
                )}
                <TouchableOpacity onPress={isEditingName ? handleSaveName : handleEditName} style={styles.editIcon}>
                    <MaterialIcons name={isEditingName ? "save" : "edit"} size={24} color="#6200EE" />
                </TouchableOpacity>
            </View>

            {/* Email */}
           

            {/* Editable Company Name */}
            <View style={styles.inputContainer}>
                {isEditingCompanyName ? (
                    <TextInput
                        style={styles.inputField}
                        value={companyName}
                        onChangeText={setCompanyName}
                        placeholder="Company Name"
                    />
                ) : (
                    <Text style={styles.textField}>{companyName}</Text>
                )}
                <TouchableOpacity onPress={isEditingCompanyName ? handleSaveCompanyName : handleEditCompanyName} style={styles.editIcon}>
                    <MaterialIcons name={isEditingCompanyName ? "save" : "edit"} size={24} color="#6200EE" />
                </TouchableOpacity>
            </View>

            {/* Editable Bio */}
            <ScrollView contentContainerStyle={[styles.scrollViewContainer,styles.bio]}>
        <View style={styles.inputContainer}>
        {isEditingBio ? (
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
            <TouchableOpacity onPress={isEditingBio ? handleSaveBio : handleEditBio} style={styles.editIcon}>
                <MaterialIcons name={isEditingBio ? "save" : "edit"} size={24} color="#6200EE" />
            </TouchableOpacity>
        </View>
    </ScrollView>

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
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 20,
        backgroundColor: '#f4f7fa',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 40,
        justifyContent: 'center',
    },
    profilePicWrapper: {
        borderRadius: 75,
        borderWidth: 3,
        borderColor: '#6200EE',
        overflow: 'hidden',
        backgroundColor: 'transparent', // Make sure border is visible on Android
    },
    profileImg: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    profileText: {
        fontSize: 14,
        color: '#6200EE',
        textAlign: 'center',
        marginTop: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        width: '100%',
    },
    inputField: {
        fontSize: 18,
        color: '#6200EE',
        borderBottomWidth: 2,
        borderBottomColor: '#6200EE',
        flex: 1,
        marginRight: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        textAlign: 'center',
    },
    textField: {
        fontSize: 20,
        color: '#6200EE',
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
    editIcon: {
        padding: 5,
    },
    email: {
        color: '#6B6B6B',
        fontSize: 16,
        marginTop: 10,
    },
    scrollViewContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingBottom: 50,
    },
    bio:{
        marginTop:10,
        fontWeight:'500',
        fontSize:18
    
    },
    textArea: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
        flex: 1,
        borderWidth: 1,
        borderColor: '#6200EE',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#f9f9f9', 
        lineHeight: 20, // Adjust lineHeight for better vertical centering
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 10,
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: '#6200EE',
        width: '80%',
        marginBottom: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#6200EE',
        textAlign: 'center',
        marginBottom:20
    },
    name:{
        marginBottom:0
    }
});
