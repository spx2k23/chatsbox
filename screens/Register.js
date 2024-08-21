import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Register = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Icon name="person-add" size={64} color="#6200EE" />
        <Text style={styles.logoText}>Register</Text>
      </View>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Name"
          placeholderTextColor="#B0BEC5"
          value={name}
          onChangeText={(text) => setName(text)}
          leftIcon={{ type: 'font-awesome', name: 'user', color: '#6200EE' }}
          inputStyle={styles.inputText}
          containerStyle={styles.inputField}
        />
        <Input
          placeholder="Email"
          placeholderTextColor="#B0BEC5"
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
        <Input
          placeholder="Re-enter Password"
          placeholderTextColor="#B0BEC5"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          secureTextEntry
          leftIcon={{ type: 'font-awesome', name: 'lock', color: '#6200EE' }}
          inputStyle={styles.inputText}
          containerStyle={styles.inputField}
        />
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
