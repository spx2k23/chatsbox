import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, gql } from '@apollo/client';
import ChatBox from '../components/ChatBox/ChatBox';
import { jwtDecode } from 'jwt-decode';

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
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (organizationId) {
        refetch();
      }
    });

    return unsubscribe;
  }, [navigation, organizationId]);

  useEffect(() => {
    if (error) {
      console.error('GraphQL Error:', error);
    }
  }, [error]);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error loading users</Text>;
  }

  if (!data || !data.getUsersInOrganization) {
    return <Text>No users found</Text>;
  }

  return (
    <View>
      <FlatList
        data={data.getUsersInOrganization}
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
    </View>
  );
};

export default Users;
