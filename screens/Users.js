import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, View, Text, StyleSheet, TextInput, Pressable, Platform } from 'react-native';
import { useQuery, gql, useApolloClient } from '@apollo/client';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import Loading from '../components/Loading/Loading';
import UserBox from '../components/UserBox/UserBox';
import FriendRequest from '../components/UserBox/FriendRequest';
import CustomNotFound from '../components/NotFound';
import theme from '../config/theme';

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
    
const FRIENDS_UPDATE = gql`
  subscription FriendsUpdate($userId: ID!) {
    friendsUpdate(userId: $userId) {
      Type
      FriendsUpdateReceiverId
      Friend {
        id
        FirstName
        LastName
        Bio
        Role
        DateOfBirth
        ProfilePicture
        Email
        MobileNumber
      }
    }
  }
`;

const Users = ({ navigation }) => {
  const client = useApolloClient();
  const [organizationId, setOrganizationId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [currentTabChoice, setCurrentTabChoice] = useState('friends');
  const [users, setUsers] = useState([]);
  const [requestCount, setRequestCount] = useState(0);

  const db = useSQLiteContext();

  useEffect(() => {
    const fetchOrgAndUser  = async () => {
      try {
        const firstRow = await db.getFirstAsync(`SELECT * FROM user`);
        setOrganizationId(firstRow.currentOrg);
        setUserId(firstRow.userId);
      } catch (error) {
        console.error('Error fetching organization or user:', error);
      }
    };
    fetchOrgAndUser ();
  }, []);

  const { loading, error, data, refetch } = useQuery(GET_USERS_IN_ORG, {
    variables: { organizationId },
    skip: !organizationId,
    onCompleted: (data) => {
      setUsers(data.getUsersInOrganization);
    },
  });

  const useFriendRequestSubscriptions = (userId) => {
    useFocusEffect(
      useCallback(() => {
        if (!userId) return;
        const friendsUpdate = client.subscribe({
          query: FRIENDS_UPDATE,
          variables: { userId },
        }).subscribe({
          next({data}) {
            if(data?.friendsUpdate) {
              const { Type } = data.friendsUpdate;
              const { FriendsUpdateReceiverId } = data.friendsUpdate;
              if(Type === "SEND_FRIEND_REQUEST"){
                console.log("send");
                updateUserStatus(FriendsUpdateReceiverId, { isRequestReceived: true });
              } else if(Type === "ACCEPT_FRIEND_REQUEST"){
                const { Friend } = data.friendsUpdate;
                console.log("accept");
                updateUserStatus(FriendsUpdateReceiverId, { isRequestSent: false, isFriend: true });
                db.runAsync(
                  `INSERT INTO friends (userId, firstName, lastName, role, dateOfBirth, profilePicture, bio, email, phoneNumber) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(userId) DO NOTHING;`,
                  [
                    Friend.id,
                    Friend.FirstName,
                    Friend.LastName,
                    Friend.Role,
                    Friend.DateOfBirth,
                    Friend.ProfilePicture,
                    Friend.Bio,
                    Friend.Email,
                    Friend.MobileNumber
                  ]
                );
              } else {
                console.log("reject");
                updateUserStatus(FriendsUpdateReceiverId, { isRequestSent: false });
              }
            }
          }
        });
        
        return () => {
          friendsUpdate.unsubscribe();
        };
      }, [userId, client])
    );
  };

  useFriendRequestSubscriptions(userId);

  useFocusEffect(
    useCallback(() => {
      if (organizationId) {
        refetch().then(refetchData => {
          if (refetchData.data) {
            setUsers(refetchData.data.getUsersInOrganization);
          }
        });
      }
    }, [refetch, organizationId])
  );

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
    // Split search text into tokens (ignoring empty strings)
    const searchTokens = searchText
      .toLowerCase()
      .split(' ')
      .filter(token => token.trim() !== '');
  
    // Check if all tokens match at least one field
    const matchesSearch = searchTokens.every(token => 
      user.FirstName?.toLowerCase().includes(token) ||
      user.SecondName?.toLowerCase().includes(token) ||
      user.Email?.toLowerCase().includes(token)||
      user.Role?.toLowerCase().includes(token)
    );
  
    // Existing tab filtering logic
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
    return <CustomNotFound title={'Error Occured'} />;
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
      {filteredUsers.length === 0 && searchText !== '' && (
        <Text style={styles.nomatch}>No matching data</Text>
      )}
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
    backgroundColor:'#fff',
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
    backgroundColor:'#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 2,
    backgroundColor:'#fff',
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
    color: theme.colors.basicColor,
    fontSize: 16,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor:theme.colors.basicColor,
    paddingBottom: Platform.OS === 'ios' ? 4 : 2, // Adjust padding for iOS
  },
  requestNumber: {
    color: '#fff',
    backgroundColor: theme.colors.basicColor,
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
    paddingLeft: Platform.OS === 'ios' ? 15 : 0, // Add left padding for iOS,
    backgroundColor:'#fff',
    flex:1
  },
  nomatch: {
    textAlign: 'center',
    marginTop: 100,
  },
});

export default Users;
