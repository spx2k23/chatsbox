import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { gql, useMutation } from '@apollo/client';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Loading from '../components/Loading/Loading';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const REGISTER = gql`
  mutation register(
    $FirstName: String!,
    $LastName: String!,
    $DateOfBirth: String!,
    $Role: String!,
    $Email: String!,
    $MobileNumber: String!,
    $Password: String!,
    $ProfilePicture: String!,
    $OrganizationCode: String!
  ) {
    register(
      FirstName: $FirstName,
      LastName: $LastName,
      DateOfBirth: $DateOfBirth,
      Role: $Role,
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
const primecolor = '#6200EE';
const placeholdercolor = "#B0BEC5";
const Register = ({ navigation }) => {
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [DateOfBirth, setDOB] = useState(null);
  const [Role, setRole] = useState('');
  const [Email, setEmail] = useState('');
  const [MobileNumber, setMobileNumber] = useState('');
  const [Password, setPassword] = useState('');
  const [ProfilePicture, setProfilePicture] = useState('');
  const [OrganizationCode, setOrganizationCode] = useState(null);
  const [ProfileUri, setProfileUri] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);


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
    if (!FirstName || !LastName || !DateOfBirth || !Role || !Email || !MobileNumber || !Password || !ProfilePicture || !OrganizationCode) {
      setErrorMessage('Please fill all the fields');
      return;
    }
    try {
      const { data } = await register({
        variables: {
          FirstName,
          LastName,
          DateOfBirth,
          Role,
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
  const formattedDate = DateOfBirth ? DateOfBirth.toLocaleDateString() : 'Date Of Birth';
  const handleConfirm = (date) => {
    setDOB(date);
    setIsVisible(false);
  };

  if (loading) {
    return <Loading />
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Register</Text>
        </View>
        <View style={styles.inputContainer}>
          <Input
            placeholder="First Name"
            placeholderTextColor="#B0BEC5"
            value={FirstName}
            onChangeText={(text) => setFirstName(text)}
            leftIcon={{ type: 'font-awesome', name: 'user', color: '#6200EE' }}
            inputStyle={styles.inputText}
            containerStyle={styles.inputField}
          />
          <Input
            placeholder="Last Name"
            placeholderTextColor="#B0BEC5"
            value={LastName}
            onChangeText={(text) => setLastName(text)}
            leftIcon={{ type: 'font-awesome', name: 'user', color: '#6200EE' }}
            inputStyle={styles.inputText}
            containerStyle={styles.inputField}
          />
          <View style={styles.dob}>
            <MaterialIcons name='cake' size={30} color={'#6200EE'} />
            <TouchableOpacity onPress={() => setIsVisible(true)} style={styles.dobselector}>
              <Text style={[styles.dobtext, { color: DateOfBirth ? '#000' : "#B0BEC5" }]} >{formattedDate}</Text>
              <MaterialIcons name='arrow-drop-down' size={24} color="#6200EE" />
            </TouchableOpacity>
            <DateTimePickerModal
              mode="date"
              isVisible={isVisible}
              onConfirm={handleConfirm}
              onCancel={() => setIsVisible(false)}
              date={DateOfBirth ? DateOfBirth : new Date()}
            />
          </View>
          <Input
            placeholder="Role"
            placeholderTextColor="#B0BEC5"
            value={Role}
            onChangeText={(text) => setRole(text)}
            leftIcon={{ type: 'font-awesome', name: 'tag', color: '#6200EE' }}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
    marginTop: Platform.OS == 'android' ? 0 : 50
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
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
  },
  inputField: {
    marginBottom: 10,
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
  dob: {
    flexDirection: 'row',
    borderBottomWidth: .3,
    borderBottomColor: '#000',
    paddingBottom: 10,
    marginBottom: 30,
  },
  dobtext: {
    fontSize: 16,
    alignSelf: 'center',
    marginLeft: 10,
    marginRight: 190
  },
  dobselector: {
    flexDirection: 'row'
  }
});

export default Register;
