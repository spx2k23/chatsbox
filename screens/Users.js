import React, { useEffect, useState } from 'react';
import {FlatList,View, Text,StyleSheet,TextInput,Pressable} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, gql } from '@apollo/client';
import ChatBox from '../components/ChatBox/ChatBox';
import { jwtDecode } from 'jwt-decode';
import Loading from '../components/Loading/Loading';

const GET_USERS_IN_ORG = gql`
  query GetUsersInOrganization($organizationId: ID!) {
    getUsersInOrganization(organizationId: $organizationId) {
      id
      Name
      Email
      ProfilePicture
      isFriend
      isRequestSent
      isRequestReceived
    }
  }
`;

const Users = ({ navigation }) => {
  const [organizationId, setOrganizationId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [currentTabChoice, setCurrentTabChoice] = useState('friends');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchOrgAndUser = async () => {
      try {
        const orgId = await AsyncStorage.getItem('organization');
        const token = await AsyncStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        setOrganizationId(orgId);
        setUserId(decodedToken.id);
      } catch (error) {
        console.error('Error fetching organization or user:', error);
      }
    };
    fetchOrgAndUser();
  }, []);

  const { loading, error, data, refetch } = useQuery(GET_USERS_IN_ORG, {
    variables: { organizationId },
    skip: !organizationId,
    onCompleted: (data) => {
      setUsers(data.getUsersInOrganization);
    },
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (organizationId) {
        refetch();
      }
    });
    return unsubscribe;
  }, [navigation, organizationId]);

  const updateUserStatus = (userIdToUpdate, updatedFields) => {
    setUsers((prevUsers) =>
      prevUsers.map(user =>
        user.id === userIdToUpdate ? { ...user, ...updatedFields } : user
      )
    );
  };

  if (loading) {
    return <Loading/>;
  }

  if (error) {
    return <Text>Error loading users</Text>;
  }

  if (!data || !data.getUsersInOrganization) {
    return <Text>No users found</Text>;
  }

  // Separate friends, others, and requests
  const friends = data.getUsersInOrganization.filter(user => user.isFriend);
  const others = data.getUsersInOrganization.filter(user => !user.isFriend);
  const requests = data.getUsersInOrganization.filter(
    user => user.isRequestSent || user.isRequestReceived
  );

  // Select data based on tab choice
  let dataList;
  if (currentTabChoice === 'friends') {
    dataList = friends;
  } else if (currentTabChoice === 'others') {
    dataList = others;
  } else {
    dataList = requests;
  }

  // Handle search logic
  const filteredUsers = users.filter(user =>
    user.Name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.Email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name or email"
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <Pressable
          onPress={() => setCurrentTabChoice('friends')}
          style={[
            styles.tabButton,
            currentTabChoice === 'friends' && styles.activeTab,
          ]}
        >
          <Text style={currentTabChoice === 'friends' ? styles.activeText : null}>
            Friends
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setCurrentTabChoice('others')}
          style={[
            styles.tabButton,
            currentTabChoice === 'others' && styles.activeTab,
          ]}
        >
          <Text style={currentTabChoice === 'others' ? styles.activeText : null}>
            Others
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setCurrentTabChoice('requests')}
          style={[
            styles.tabButton,
            currentTabChoice === 'requests' && styles.activeTab,
          ]}
        >
          <Text style={currentTabChoice === 'requests' ? styles.activeText : null}>
            Requests
          </Text>
        </Pressable>
      </View>

      {/* If search text exists, show filtered users */}
      {searchText ? (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBox
              image={item.ProfilePicture}
              name={item.Name}
              email={item.Email}
              isFriend={item.isFriend}
              isRequestSent={item.isRequestSent}
              isRequestReceived={item.isRequestReceived}
              userId={userId}
              receiverId={item.id}
              refetch={refetch}
              updateUserStatus={updateUserStatus}
            />
          )}
          ListHeaderComponent={<Text style={styles.header}>Search Results</Text>}
        />
      ) : (
        <FlatList
          data={dataList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBox
              image={item.ProfilePicture}
              name={item.Name}
              email={item.Email}
              isFriend={item.isFriend}
              isRequestSent={item.isRequestSent}
              isRequestReceived={item.isRequestReceived}
              userId={userId}
              receiverId={item.id}
              refetch={refetch}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginTop:6,
    width:'90%',
    alignSelf:'center'
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 2,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  activeText: {
    color: '#6200EE',
    fontSize:16,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
});

export default Users;
