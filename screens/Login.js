import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLazyQuery, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading/Loading';
import theme from '../config/theme';
import realm from '../db_configs/realm';

const LOGIN_QUERY = gql`
  query Login($Email: String!, $Password: String!) {
    login(Email: $Email, Password: $Password) {
      success
      message
      token
      user {
        id
        FirstName
        LastName
        DateOfBirth
        Role
        Bio
        ProfilePicture
        Email
        MobileNumber
        Organization {
          OrganizationId{
            id
            OrganizationName
            OrganizationLogo
          }
          SuperAdmin
          adminRights
        }
      }
    }
  }
`;

const Login = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [login, { loading }] = useLazyQuery(LOGIN_QUERY, {
    onCompleted: async (data) => {
      if (data.login.success) {
        await AsyncStorage.setItem('token', data.login.token);
        const user = data.login.user;
        realm.write(() => {
          realm.delete(realm.objects('User'));
          realm.delete(realm.objects('Organization'));

          realm.create('User', {
            userId: user.id,
            firstName: user.FirstName,
            lastName: user.LastName,
            role: user.Role,
            dateOfBirth: user.DateOfBirth,
            profilePicture: user.ProfilePicture,
            bio: user.Bio,
            email: user.Email,
            phoneNumber: user.MobileNumber,
            currentOrg: user.Organization[0].OrganizationId.id
          });

          user.Organization.forEach(org => {
            const orgId = org.OrganizationId;
            realm.create('Organization', {
              organizationId: orgId.id,
              organizationName: orgId.OrganizationName,
              OrganizationLogo: orgId.OrganizationLogo,
              superAdmin: org.SuperAdmin,
              adminRights: org.adminRights
            });
          });
        });

      } else {
        setErrorMessage(data.login.message);
      }
    },
    onError: (error) => {
      console.log('GraphQL Error:', error);
      setErrorMessage('An error occurred. Please try again.');
    },
  });

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }
    setErrorMessage('');
    login({ variables: { Email: email, Password: password } });
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      {loading &&
        <Loading />
      }
      <View style={styles.logoContainer}>
        <Icon name="chat" size={80} color={theme.colors.basicColor} />
        <Text style={styles.logoText}>Bush</Text>
      </View>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          placeholderTextColor="#B0BEC5"
          keyboardType='email-address'
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
          leftIcon={{ type: 'font-awesome', name: 'envelope', color: theme.colors.basicColor }}
          inputStyle={styles.inputText}
          containerStyle={styles.inputField}
        />
        <Input
          placeholder="Password"
          placeholderTextColor="#B0BEC5"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          leftIcon={{ type: 'font-awesome', name: 'lock', color: theme.colors.basicColor}}
          inputStyle={styles.inputText}
          containerStyle={styles.inputField}
        />
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      </View>
      <Button
        title="Login"
        onPress={handleLogin}
        buttonStyle={styles.loginButton}
        titleStyle={styles.loginButtonText}
      />
      <TouchableOpacity onPress={handleRegister}>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
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
    color: theme.colors.basicColor,
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
    width: '90%',
    alignSelf: 'center'
  },
  inputField: {
    marginBottom: 15,
  },
  inputText: {
    color: '#37474F',
    padding: 10
  },
  loginButton: {
    backgroundColor: theme.colors.basicColor,
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 20,
    width: '60%',
    alignSelf: 'center'
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    textAlign: 'center',
    color: theme.colors.basicColor,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Login;
