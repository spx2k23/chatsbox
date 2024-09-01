import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useMutation, gql } from '@apollo/client';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const REGISTER_ORGANIZATION = gql`
  mutation registerOrganization(
    $Name: String!,
    $Email: String!,
    $MobileNumber: String!,
    $Password: String!,
    $ProfilePicture: String!,
    $OrganizationName: String!,
    $OrganizationCode: String!
  ) {
    registerOrganization(
      Name: $Name,
      Email: $Email,
      MobileNumber: $MobileNumber,
      Password: $Password,
      ProfilePicture: $ProfilePicture,
      OrganizationName: $OrganizationName,
      OrganizationCode: $OrganizationCode
    ) {
      success
      message
    }
  }
`;

const OrganizationReg = ({ navigation }) => {
    const [OrganizationName, setOrganizationName] = useState('');
    const [OrganizationCode, setOrganizationCode] = useState('');
    const [Name, setName] = useState('');
    const [Email, setEmail] = useState('');
    const [MobileNumber, setMobileNumber] = useState('');
    const [Password, setPassword] = useState('');
    const [ProfilePicture, setProfilePicture] = useState('');
    const [ProfileUri, setProfileUri] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [registerOrganization, { data, loading, error }] = useMutation(REGISTER_ORGANIZATION);

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access media library is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            const base64 = await FileSystem.readAsStringAsync(asset.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            setProfileUri(asset.uri);
            setProfilePicture(base64);
        }
    };

    const handleRegister = async () => {
        if (!OrganizationName || !OrganizationCode || !Name || !Email || !MobileNumber || !Password || !ProfilePicture) {
            setErrorMessage('Please fill all the fields');
            return;
        }
        try {
            const { data } = await registerOrganization({
                variables: {
                    OrganizationName,
                    OrganizationCode,
                    Name,
                    Email,
                    MobileNumber,
                    Password,
                    ProfilePicture
                }
            });

            if (data.registerOrganization.success) {
                alert(data.registerOrganization.message);
                navigation.navigate('Login');
            } else {
                setErrorMessage(data.registerOrganization.message);
            }
        } catch (err) {
            setErrorMessage('An error occurred. Please try again.');
        }    
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>Register</Text>
            </View>
            <View style={styles.inputContainer}>
                <Input
                    placeholder="OrganizationName"
                    placeholderTextColor="#B0BEC5"
                    value={OrganizationName}
                    onChangeText={(text) => setOrganizationName(text)}
                    leftIcon={{ type: 'font-awesome', name: 'building', color: '#6200EE' }}
                    inputStyle={styles.inputText}
                    containerStyle={styles.inputField}
                />
                <Input
                    placeholder="Create code for your organization"
                    placeholderTextColor="#B0BEC5"
                    value={OrganizationCode}
                    onChangeText={(text) => setOrganizationCode(text)}
                    leftIcon={{ type: 'font-awesome', name: 'building', color: '#6200EE' }}
                    inputStyle={styles.inputText}
                    containerStyle={styles.inputField}
                    maxLength={6}
                />
                <Input
                    placeholder="Name"
                    placeholderTextColor="#B0BEC5"
                    value={Name}
                    onChangeText={(text) => setName(text)}
                    leftIcon={{ type: 'font-awesome', name: 'user', color: '#6200EE' }}
                    inputStyle={styles.inputText}
                    containerStyle={styles.inputField}
                />
                <Input
                    placeholder="Email"
                    placeholderTextColor="#B0BEC5"
                    value={Email}
                    onChangeText={(text) => setEmail(text)}
                    leftIcon={{ type: 'font-awesome', name: 'envelope', color: '#6200EE' }}
                    inputStyle={styles.inputText}
                    containerStyle={styles.inputField}
                />
                <Input
                    placeholder="Mobile Number"
                    placeholderTextColor="#B0BEC5"
                    value={MobileNumber}
                    onChangeText={(text) => setMobileNumber(text)}
                    leftIcon={{ type: 'font-awesome', name: 'phone', color: '#6200EE' }}
                    inputStyle={styles.inputText}
                    containerStyle={styles.inputField}
                />
                <Input
                    placeholder="Password"
                    placeholderTextColor="#B0BEC5"
                    value={Password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry
                    leftIcon={{ type: 'font-awesome', name: 'lock', color: '#6200EE' }}
                    inputStyle={styles.inputText}
                    containerStyle={styles.inputField}
                />
                <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
                    <Text style={styles.imagePickerText}>Pick Profile Picture</Text>
                </TouchableOpacity>
                {ProfileUri ? (
                    <Image
                        source={{ uri: ProfileUri }}
                        style={styles.profileImage}
                    />
                ) : null}
                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
                {loading ? <Text>loading...</Text> : null}
            </View>
            <Button
                title="Register"
                onPress={handleRegister}
                buttonStyle={styles.registerButton}
                titleStyle={styles.registerButtonText}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6200EE',
        marginTop: 10,
    },
    inputContainer: {
        marginBottom: 20,
        width: '90%',
        alignSelf: 'center',
    },
    inputField: {
        marginBottom: 15,
    },
    inputText: {
        color: '#37474F',
        padding: 10,
    },
    registerButton: {
        backgroundColor: '#6200EE',
        borderRadius: 25,
        paddingVertical: 15,
        marginBottom: 20,
        width: '60%',
        alignSelf: 'center',
    },
    registerButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginText: {
        textAlign: 'center',
        color: '#6200EE',
        fontSize: 16,
    },
    error: {
        color: 'red',
        marginBottom: 15,
        textAlign: 'center',
    },
    imagePicker: {
        backgroundColor: '#6200EE',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        marginVertical: 15,
    },
    imagePickerText: {
        color: '#fff',
        fontSize: 16,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 20,
    },
});

export default OrganizationReg;
