import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { gql, useMutation } from '@apollo/client';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const REGISTER = gql`
  mutation register(
    $Name: String!,
    $Email: String!,
    $MobileNumber: String!,
    $Password: String!,
    $ProfilePicture: String!,
    $OrganizationCode: String!
  ) {
    register(
      Name: $Name,
      Email: $Email,
      MobileNumber: $MobileNumber,
      Password: $Password,
      ProfilePicture: $ProfilePicture,
      OrganizationCode: $OrganizationCode
    ) {
      success
      message
    }
  }
`;

const Register = ({ navigation }) => {
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [MobileNumber, setMobileNumber] = useState('');
  const [Password, setPassword] = useState('');
  const [ProfilePicture, setProfilePicture] = useState('');
  const [OrganizationCode, setOrganizationCode] = useState(null);
  const [ProfileUri, setProfileUri] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [register, { data, loading, error }] = useMutation(REGISTER);

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
    setErrorMessage('');
    if (!Name || !Email || !MobileNumber || !Password || !ProfilePicture || !OrganizationCode) {
      setErrorMessage('Please fill all the fields');
      return;
    }
    try {
      const { data } = await register({
        variables: {
          Name,
          Email,
          MobileNumber,
          Password,
          ProfilePicture,
          OrganizationCode
        }
      });

      if (data.register.success) {
        alert(data.register.message);
        navigation.navigate('Login');
      } else {
        setErrorMessage(data.register.message);
      }
    } catch (err) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Register</Text>
      </View>
      <View style={styles.inputContainer}>
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
        <Input
          placeholder="Organization code"
          placeholderTextColor="#B0BEC5"
          value={OrganizationCode}
          onChangeText={(text) => setOrganizationCode(text)}
          leftIcon={{ type: 'font-awesome', name: 'building', color: '#6200EE' }}
          inputStyle={styles.inputText}
          containerStyle={styles.inputField}
          maxLength={6}
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
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('OrganizationReg')}>
        <Text style={styles.loginText}>Register Organization</Text>
      </TouchableOpacity>
    </View>
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

export default Register;
