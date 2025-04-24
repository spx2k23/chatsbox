import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLazyQuery, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import Loading from '../components/Loading/Loading';
import { useSQLiteContext } from 'expo-sqlite';
import theme from '../config/theme';

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

  const db = useSQLiteContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("token");
  //       if (token) {
  //         const decodedToken = jwtDecode(token);
  //         const currentTime = Date.now() / 1000;
  //         if (decodedToken.exp && decodedToken.exp < currentTime) {
  //           await AsyncStorage.removeItem("token");
  //           navigation.navigate("Login");
  //         } else {
  //           navigation.replace("Chats");
  //         }
  //       } else {
  //         console.log("No token found");
  //       }
  //     } catch (error) {
  //       console.log("Error retrieving token:", error);
  //     }
  //   };

  //   checkLoginStatus();
  // }, []);

  const [login, { loading }] = useLazyQuery(LOGIN_QUERY, {
    onCompleted: async (data) => {
      if (data.login.success) {
        await AsyncStorage.setItem('token', data.login.token);
        const user = data.login.user;
        const firstRow = await db.getFirstAsync('SELECT * FROM user');
        // console.log(firstRow.lastName);

        if (firstRow === null) {
          await db.runAsync(
            `INSERT INTO user (userId, firstName, lastName, role, dateOfBirth, profilePicture, bio, email, phoneNumber, currentOrg) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(userId) DO NOTHING;`,
            [user.id, user.FirstName, user.LastName, user.Role, user.DateOfBirth, user.ProfilePicture, user.Bio, user.Email, user.MobileNumber, user.Organization[0].OrganizationId.id]
          )
          const organizations = user.Organization;
          for (const org of organizations) {
            const { OrganizationId, SuperAdmin, adminRights } = org;
            await db.runAsync(
              `INSERT INTO organizations (organizationId, organizationName, OrganizationLogo, superAdmin, adminRights) VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(organizationId) DO NOTHING;`,
              [OrganizationId.id, OrganizationId.OrganizationName, OrganizationId.OrganizationLogo, SuperAdmin, adminRights]
            )
          }
          console.log("if");
          navigation.replace('Chats');
        } else if (firstRow.userId === user.id) {
          console.log("else if");
          navigation.replace('Chats');
        } else {
          await db.runAsync(`DELETE FROM user WHERE userId = $userId`, { $userId: firstRow.userId })
          await db.runAsync('DELETE FROM organizations')
          await db.runAsync(
            `INSERT INTO user (userId, firstName, lastName, role, dateOfBirth, profilePicture, bio, email, phoneNumber, currentOrg) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(userId) DO NOTHING;`,
            [user.id, user.FirstName, user.LastName, user.Role, user.DateOfBirth, user.ProfilePicture, user.Bio, user.Email, user.MobileNumber, user.Organization[0].OrganizationId.id]
          )
          const organizations = user.Organization;
          for (const org of organizations) {
            const { OrganizationId, SuperAdmin, adminRights } = org;
            await db.runAsync(
              `INSERT INTO organizations (organizationId, organizationName, OrganizationLogo, superAdmin, adminRights) VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(organizationId) DO NOTHING;`,
              [OrganizationId.id, OrganizationId.OrganizationName, OrganizationId.OrganizationLogo, SuperAdmin, adminRights]
            )
          }
          console.log("else");
          navigation.replace('Chats');
        }

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
