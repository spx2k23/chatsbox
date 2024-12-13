import React, { useEffect, useState, useMemo } from 'react';
import { FlatList, View, Text, StyleSheet, TextInput, Pressable ,Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, gql, useSubscription } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import Loading from '../components/Loading/Loading';
import UserBox from '../components/UserBox/UserBox';
import FriendRequest from '../components/UserBox/FriendRequest';
import CustomError from '../components/Error';
import CustomNotFound from '../components/NotFound';

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

const FRIEND_REQUEST_SUBSCRIPTION = gql`
  subscription FriendRequestSent($receiverId: ID!) {
    friendRequestSent(receiverId: $receiverId) {
      senderId
      receiverId
      sender {
        Name
      }
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
        Name
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

  useSubscription(FRIEND_REQUEST_SUBSCRIPTION, {
    variables: { receiverId: userId },
    onData: ({ data }) => {
      if (data) {
        const { friendRequestSent } = data.data;
        if (friendRequestSent) {
          const { senderId, sender } = friendRequestSent;
          updateUserStatus(senderId, { isRequestReceived: true });
        }
      }
    },
  });

  useSubscription(ACCEPT_FRIEND_SUBSCRIPTION, {
    variables: { receiverId: userId },
    onData: ({ data }) => {
      if (data) {
        const { friendRequestAccept } = data.data;
        if (friendRequestAccept) {
          const { senderId, sender } = friendRequestAccept;
          updateUserStatus(senderId, { isRequestSent: false, isFriend: true });
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
      const updatedUsers = prevUsers.map(user =>
        user.id === userIdToUpdate ? { ...user, ...updatedFields } : user
      );
      return updatedUsers;
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.Name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.Email.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, users]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <CustomError title="Error occurred" />;
  }

  if (!data || !data.getUsersInOrganization) {
    return <CustomNotFound title="No data available" />;
  }

  const friends = users.filter(user => user.isFriend);
  const others = users.filter(user => !user.isFriend && !user.isRequestSent && !user.isRequestReceived);
  const requests = users.filter(user => user.isRequestSent || user.isRequestReceived);

  let dataList;
  if (currentTabChoice === 'friends') {
    dataList = friends;
  } else if (currentTabChoice === 'others') {
    dataList = others;
  } else {
    dataList = requests;
  }

  const requestCount = requests.length;

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
            styles.requesttab,
          ]}
        >
          <Text style={currentTabChoice === 'requests' ? styles.activeText : null}>
            Requests
          </Text>
          {requestCount > 0 && <Text style={styles.requestNumber}>{requestCount}</Text>}
        </Pressable>
      </View>

      {/* If search text exists, show filtered users */}
      {searchText ? (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserBox
              image={item.ProfilePicture}
              name={item.Name}
              email={item.Email}
              isFriend={item.isFriend}
              isRequestSent={item.isRequestSent}
              isRequestReceived={item.isRequestReceived}
              userId={userId}
              receiverId={item.id}
              updateUserStatus={updateUserStatus}
            />
          )}
          ListHeaderComponent={<Text style={styles.header}>Search Results</Text>}
        />
      ) : (
        <FlatList
          data={dataList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            if (currentTabChoice === 'requests') {
              return (
                <FriendRequest
                  name={item.Name}
                  email={item.Email}
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
                  name={item.Name}
                  email={item.Email}
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
    marginTop: 6,
    width: '90%',
    alignSelf: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tabButton: {
    flexDirection: 'row', // Align text and number horizontally
    alignItems: 'center', // Ensure both are vertically centered
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  activeText:{
    color: '#6200EE',
    fontSize: 16,
    fontWeight: 'bold',
    borderBottomWidth:1,  // Thinner border on iOS, thicker on Android
    borderBottomColor: '#6200EE',  // Color of the underline
    paddingBottom: Platform.OS === 'ios' ? 2 : 1, // Add padding to ensure the underline isn't too close to the text
  },
  requestNumber: {
    color: '#fff',
    backgroundColor: '#6200EE',
    paddingHorizontal: 8, // Increase padding to make the circle larger
    paddingVertical: 4, // Adjust vertical padding for balance
    borderRadius: 50, // Use a smaller number for perfect circle, making it more rounded
    marginLeft: 8, // Space between "Requests" text and the number
    fontSize: 12, // Increase font size slightly for better visibility
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center', // Ensure the text is centered
    height: 24, // Fixed height for a more consistent circle size
    width: 24, // Fixed width for a perfect circle
  },  
  requesttab: {
    display: 'flex',
  },
 
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default Users;
