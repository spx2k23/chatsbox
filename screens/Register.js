import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Picker } from '@react-native-picker/picker';

const GET_ALL_ORGANIZATIONS_QUERY = gql`
  query GetOrganizations {
    getOrganizations {
      id
      OrganizationName
    }
  }
`;

const REGISTER = gql`
  mutation register(
    $Name: String!,
    $Email: String!,
    $MobileNumber: String!,
    $Password: String!,
    $ProfilePicture: String!,
    $Organization: String!
  ) {
    register(
      Name: $Name,
      Email: $Email,
      MobileNumber: $MobileNumber,
      Password: $Password,
      ProfilePicture: $ProfilePicture,
      Organization: $Organization
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
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  const { loading, error, data } = useQuery(GET_ALL_ORGANIZATIONS_QUERY);

  const [register, { registerdata, registerloading, registererror }] = useMutation(REGISTER);

  const handleRegister = async () => {
    if (!Name || !Email || !MobileNumber || !Password || !ProfilePicture || !selectedOrganization) {
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
          Organization: selectedOrganization
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
        {data && (
          <Picker
            selectedValue={selectedOrganization}
            onValueChange={(itemValue) => setSelectedOrganization(itemValue)}
          >
            <Picker.Item label="Select Organization" value="" />
            {data.getOrganizations.map((org) => (
              <Picker.Item key={org.id} label={org.OrganizationName} value={org.id} />
            ))}
          </Picker>
        )}
        {/* <Input
          placeholder="ProfilePicture"
          placeholderTextColor="#B0BEC5"
          value={ProfilePicture}
          onChangeText={(text) => setProfilePicture(text)}
          leftIcon={{ type: 'font-awesome', name: 'image', color: '#6200EE' }}
          inputStyle={styles.inputText}
          containerStyle={styles.inputField}
        /> */}
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
});

export default Register;
