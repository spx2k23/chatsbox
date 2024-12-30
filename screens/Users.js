import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet, TextInput, Pressable, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, gql, useSubscription } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import Loading from '../components/Loading/Loading';
import { useSQLiteContext } from 'expo-sqlite';
import UserBox from '../components/UserBox/UserBox';
import FriendRequest from '../components/UserBox/FriendRequest';
import CustomNotFound from '../components/NotFound';

const GET_USERS_IN_ORG = gql`
  query GetUsersInOrganization($organizationId: ID!) {
    getUsersInOrganization(organizationId: $organizationId) {
      id
      FirstName
      LastName
      Email
      Role
      Bio
      ProfilePicture
      isFriend
      isRequestSent
      isRequestReceived
    }
  }
`;

const FRIEND_REQUEST_SUBSCRIPTION = gql`
  subscription FriendRequestSent($receiverId: ID!) {
    friendRequestSent(receiverId: $receiverId) {
      senderId
      receiverId
    }
  }
`;

const ACCEPT_FRIEND_SUBSCRIPTION = gql`
  subscription FriendRequestAccept($receiverId: ID!) {
    friendRequestAccept(receiverId: $receiverId) {
      senderId
      receiverId
      sender {
        id
        FirstName
        LastName
        ProfilePicture
        Email
        MobileNumber
      }
    }
  }
`;

const REJECT_FRIEND_SUBSCRIPTION = gql`
  subscription FriendRequestReject($receiverId: ID!) {
    friendRequestReject(receiverId: $receiverId) {
      senderId
      receiverId
    }
  }
`;

const Users = ({ navigation }) => {
  const [organizationId, setOrganizationId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [currentTabChoice, setCurrentTabChoice] = useState('friends');
  const [users, setUsers] = useState([]);
  const [requestCount, setRequestCount] = useState(0);

  const db = useSQLiteContext();

  useEffect(() => {
    const fetchOrgAndUser = async () => {
      try {
        const firstRow = await db.getFirstAsync(`SELECT * FROM user`);
        const token = await AsyncStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        setOrganizationId(firstRow.currentOrg);
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

  useSubscription(FRIEND_REQUEST_SUBSCRIPTION, {
    variables: { receiverId: userId },
    onData: ({ data }) => {
      if (data) {
        const { friendRequestSent } = data.data;
        if (friendRequestSent) {
          const { senderId } = friendRequestSent;
          updateUserStatus(senderId, { isRequestReceived: true });
        }
      }
    },
  });

  useSubscription(ACCEPT_FRIEND_SUBSCRIPTION, {
    variables: { receiverId: userId },
    onData: async ({ data }) => {
      if (data) {
        const { friendRequestAccept } = data.data;
        if (friendRequestAccept) {
          const { senderId, sender } = friendRequestAccept;
          updateUserStatus(senderId, { isRequestSent: false, isFriend: true });
          await db.runAsync(
            `INSERT INTO friends (userId, firstName, lastName, profilePicture, email, phoneNumber) VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(userId) DO NOTHING;`,
            [sender.id, sender.FirstName, sender.LastName, sender.ProfilePicture, sender.Email, sender.MobileNumber]
          )
        }
      }
    },
  });

  useSubscription(REJECT_FRIEND_SUBSCRIPTION, {
    variables: { receiverId: userId },
    onData: ({ data }) => {
      if (data) {
        const { friendRequestReject } = data.data;
        if (friendRequestReject) {
          const { senderId } = friendRequestReject;
          updateUserStatus(senderId, { isRequestSent: false });
        }
      }
    },
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (organizationId) {
        refetch().then(refetchData => {
          if (refetchData.data) {
            setUsers(refetchData.data.getUsersInOrganization);
          }
        });
      }
    });

    return unsubscribe;
  }, [navigation, organizationId]);

  const updateUserStatus = (userIdToUpdate, updatedFields) => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) =>
        user.id === userIdToUpdate ? { ...user, ...updatedFields } : user
      );
      return updatedUsers;
    });
  };

  useEffect(() => {
    setRequestCount(users.filter(user => user.isRequestSent || user.isRequestReceived).length);
  }, [users]);

  // Filtered users based on search and tab choice
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.FirstName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.Email.toLowerCase().includes(searchText.toLowerCase());
      
    const isInCurrentTab =
      currentTabChoice === 'friends'
        ? user.isFriend
        : currentTabChoice === 'requests'
        ? user.isRequestSent || user.isRequestReceived
        : !user.isFriend && !user.isRequestSent && !user.isRequestReceived;

    return matchesSearch && isInCurrentTab;
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <CustomNotFound title={'No data available'} />;
  }

  if (!data || !data.getUsersInOrganization) {
    return <CustomNotFound title={'No data available'} />;
  }

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
          style={[styles.tabButton, currentTabChoice === 'friends' && styles.activeTab]}
        >
          <Text style={currentTabChoice === 'friends' ? styles.activeText : null}>
            Friends
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setCurrentTabChoice('others')}
          style={[styles.tabButton, currentTabChoice === 'others' && styles.activeTab]}
        >
          <Text style={currentTabChoice === 'others' ? styles.activeText : null}>
            Others
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setCurrentTabChoice('requests')}
          style={[styles.tabButton, currentTabChoice === 'requests' && styles.activeTab]}
        >
          <Text style={currentTabChoice === 'requests' ? styles.activeText : null}>
            Requests
          </Text>
          {requestCount > 0 && <Text style={styles.requestNumber}>{requestCount}</Text>}
        </Pressable>
      </View>

      {/* Render filtered users based on search and tab */}
      <FlatList
        contentContainerStyle={styles.flatListContainer} 
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (currentTabChoice === 'requests') {
            return (
              <FriendRequest
                firstName={item.FirstName}
                lastName={item.LastName}
                email={item.Email}
                role={item.Role}
                bio={item.Bio}
                image={item.ProfilePicture}
                userId={userId}
                receiverId={item.id}
                isRequestSent={item.isRequestSent}
                isRequestReceived={item.isRequestReceived}
                updateUserStatus={updateUserStatus}
              />
            );
          } else {
            return (
              <UserBox
                image={item.ProfilePicture}
                firstName={item.FirstName}
                lastName={item.LastName}
                email={item.Email}
                role={item.Role}
                bio={item.Bio}
                isFriend={item.isFriend}
                isRequestSent={item.isRequestSent}
                isRequestReceived={item.isRequestReceived}
                userId={userId}
                receiverId={item.id}
                updateUserStatus={updateUserStatus}
              />
            );
          }
        }}
      />
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
    marginTop: 6,
    width: '90%',
    alignSelf: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 2,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    paddingBottom: Platform.OS === 'ios' ? 8 : 10, // Adjust padding for iOS
  },
  activeText: {
    color: '#6200EE',
    fontSize: 16,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#6200EE',
    paddingBottom: Platform.OS === 'ios' ? 4 : 2, // Adjust padding for iOS
  },
  requestNumber: {
    color: '#fff',
    backgroundColor: '#6200EE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 50,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    height: 24,
    width: 24,
    marginLeft: 8,
  },
  flatListContainer: {
    paddingLeft: Platform.OS === 'ios' ? 15 : 0, // Add left padding for iOS
  },
});

export default Users;
