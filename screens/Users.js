import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet, TextInput, Pressable, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, gql, useSubscription, useApolloClient } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import Loading from '../components/Loading/Loading';
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
  subscription FriendRequestSent($userId: ID!) {
    friendRequestSent(userId: $userId) {
      friendRequestSenderId
    }
  }
`;

const ACCEPT_FRIEND_SUBSCRIPTION = gql`
  subscription FriendRequestAccept($userId: ID!) {
    friendRequestAccept(userId: $userId) {
      friendRequestAccepterId
      friendRequestAccepter {
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

const REJECT_FRIEND_SUBSCRIPTION = gql`
  subscription FriendRequestReject($userId: ID!) {
    friendRequestReject(userId: $userId) {
      friendRequestRejecterId
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

  useFocusEffect(
    React.useCallback(() => {
      const subscriptions = [];
  
      if (userId) {
        const friendRequestObservable = client.subscribe({
          query: FRIEND_REQUEST_SUBSCRIPTION,
          variables: { userId },
        });
        const friendRequestSubscription = friendRequestObservable.subscribe({
          next({ data }) {
            if (data?.friendRequestSent) {
              const { friendRequestSenderId } = data.friendRequestSent;
              updateUserStatus(friendRequestSenderId, { isRequestReceived: true });
              console.log("Friend Request Received:", friendRequestSenderId);
            }
          },
          error(err) {
            console.error("Friend Request Subscription error:", err);
          },
        });
        subscriptions.push(friendRequestSubscription);

        const acceptFriendObservable = client.subscribe({
          query: ACCEPT_FRIEND_SUBSCRIPTION,
          variables: { userId },
        });
        const acceptFriendSubscription = acceptFriendObservable.subscribe({
          next({ data }) {
            if (data?.friendRequestAccept) {
              const { friendRequestAccepterId, friendRequestAccepter } = data.friendRequestAccept;
              updateUserStatus(friendRequestAccepterId, { isRequestSent: false, isFriend: true });
              db.runAsync(
                `INSERT INTO friends (userId, firstName, lastName, role, dateOfBirth, profilePicture, bio, email, phoneNumber) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(userId) DO NOTHING;`,
                [
                  friendRequestAccepter.id,
                  friendRequestAccepter.FirstName,
                  friendRequestAccepter.LastName,
                  friendRequestAccepter.Role,
                  friendRequestAccepter.DateOfBirth,
                  friendRequestAccepter.ProfilePicture,
                  friendRequestAccepter.Bio,
                  friendRequestAccepter.Email,
                  friendRequestAccepter.MobileNumber,
                ]
              );
              console.log("Friend Request Accepted:", friendRequestAccepterId);
            }
          },
          error(err) {
            console.error("Accept Friend Subscription error:", err);
          },
        });
        subscriptions.push(acceptFriendSubscription);

        const rejectFriendObservable = client.subscribe({
          query: REJECT_FRIEND_SUBSCRIPTION,
          variables: { userId },
        });
        const rejectFriendSubscription = rejectFriendObservable.subscribe({
          next({ data }) {
            if (data?.friendRequestReject) {
              const { friendRequestRejecterId } = data.friendRequestReject;
              updateUserStatus(friendRequestRejecterId, { isRequestSent: false });
              console.log("Friend Request Rejected:", friendRequestRejecterId);
            }
          },
          error(err) {
            console.error("Reject Friend Subscription error:", err);
          },
        });
        subscriptions.push(rejectFriendSubscription);
      }
  
      return () => {
        subscriptions.forEach((subscription) => subscription.unsubscribe());
      };
    }, [userId, client, db])
  );

  // useSubscription(FRIEND_REQUEST_SUBSCRIPTION, {
  //   variables: { userId },
  //   onData: ({ data }) => {
  //     if (data) {
  //       const { friendRequestSent } = data.data;
  //       if (friendRequestSent) {
  //         const { friendRequestSenderId } = friendRequestSent;
  //         updateUserStatus(friendRequestSenderId, { isRequestReceived: true });
  //       }
  //     }
  //   },
  // });

  // useSubscription(ACCEPT_FRIEND_SUBSCRIPTION, {
  //   variables: { userId },
  //   onData: async ({ data }) => {
  //     if (data) {
  //       const { friendRequestAccept } = data.data;
  //       if (friendRequestAccept) {
  //         const { friendRequestAccepterId, friendRequestAccepter } = friendRequestAccept;
  //         updateUserStatus(friendRequestAccepterId, { isRequestSent: false, isFriend: true });
  //         await db.runAsync(
  //           `INSERT INTO friends (userId, firstName, lastName, role, dateOfBirth, profilePicture, bio, email, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  //             ON CONFLICT(userId) DO NOTHING;`,
  //           [friendRequestAccepter.id, friendRequestAccepter.FirstName, friendRequestAccepter.LastName, friendRequestAccepter.Role, friendRequestAccepter.DateOfBirth, friendRequestAccepter.ProfilePicture, friendRequestAccepter.Bio, friendRequestAccepter.Email, friendRequestAccepter.MobileNumber]
  //         )
  //       }
  //     }
  //   },
  // });

  // useSubscription(REJECT_FRIEND_SUBSCRIPTION, {
  //   variables: { userId },
  //   onData: ({ data }) => {
  //     if (data) {
  //       const { friendRequestReject } = data.data;
  //       if (friendRequestReject) {
  //         const { friendRequestRejecterId } = friendRequestReject;
  //         updateUserStatus(friendRequestRejecterId, { isRequestSent: false });
  //       }
  //     }
  //   },
  // });

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
    const searchTextLower = searchText.toLowerCase();
    const matchesSearch =
      ( user.FirstName?.toLowerCase().includes(searchTextLower)) ||
      (user.SecondName?.toLowerCase().includes(searchTextLower)) ||
      (user.Email?.toLowerCase().includes(searchTextLower));
  
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
      {filteredUsers.length===0&&searchText!==''&&<Text style={styles.nomatch}>No matching data</Text>}
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
          }
           else {
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
  nomatch:{
     textAlign:'center',
     marginTop:100
  }
});

export default Users;
