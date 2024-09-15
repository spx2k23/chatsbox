import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLazyQuery, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const LOGIN_QUERY = gql`
  query Login($Email: String!, $Password: String!) {
    login(Email: $Email, Password: $Password) {
      success
      message
      token
      organization
    }
  }
`;

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            await AsyncStorage.removeItem("token");
            navigation.navigate("Login");
          } else {
            navigation.navigate("Chats");
          }
        } else {
          console.log("No token found");
        }
      } catch (error) {
        console.log("Error retrieving token:", error);
      }
    };

    checkLoginStatus();
  }, []);

  const [login, { loading }] = useLazyQuery(LOGIN_QUERY, {
    onCompleted: async (data) => {
      if (data.login.success) {
        await AsyncStorage.setItem('token', data.login.token);
        await AsyncStorage.setItem('organization', data.login.organization);
        navigation.navigate('Chats');
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
      <View style={styles.logoContainer}>
        <Icon name="chat" size={80} color="#6200EE" />
        <Text style={styles.logoText}>Bush</Text>
      </View>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          placeholderTextColor="#B0BEC5"
          keyboardType='email-address'
          value={email}
          onChangeText={(text) => setEmail(text)}
          leftIcon={{ type: 'font-awesome', name: 'envelope', color: '#6200EE' }}
          inputStyle={styles.inputText}
          containerStyle={styles.inputField}
        />
        <Input
          placeholder="Password"
          placeholderTextColor="#B0BEC5"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          leftIcon={{ type: 'font-awesome', name: 'lock', color: '#6200EE' }}
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
    color: '#6200EE',
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
    backgroundColor: '#6200EE',
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
    color: '#6200EE',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Login;
