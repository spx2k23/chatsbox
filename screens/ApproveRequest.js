import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import RequestContainer from '../components/ChatList/RequestContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading/Loading';

const GET_UNAPPROVED_USERS = gql`
  query GetUnapprovedUsers($organizationId: ID!) {
    getUnapprovedUsers(organizationId: $organizationId) {
      id
      Name
      Email
      ProfilePicture
    }
  }
`;

const ApproveRequest = ({ navigation }) => {
  const [organizationId, setOrganizationId] = useState(null);

  useEffect(() => {
    const fetchOrganizationId = async () => {
      const storedOrganizationId = await AsyncStorage.getItem('organization');
      setOrganizationId(storedOrganizationId);
    };

    fetchOrganizationId();
  }, []);

  const { data, loading, error, refetch } = useQuery(GET_UNAPPROVED_USERS, {
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

  if (loading) return <Loading/>
  if (error) return <View><Text>Error loading data</Text></View>;

  return (
    <View style={styles.container}>
      <FlatList 
        data={data?.getUnapprovedUsers}
        renderItem={({ item }) => (
          <RequestContainer 
            name={item.Name} 
            email={item.Email} 
            image={item.ProfilePicture} 
            userId={item.id} 
            refetch={refetch} 
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
});

export default ApproveRequest;
