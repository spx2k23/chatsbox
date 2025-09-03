import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import RequestContainer from '../components/ChatList/RequestContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading/Loading';
import CustomError  from '../components/Error';
import theme from '../config/theme';
import { ms ,vs} from 'react-native-size-matters';
import { Feather } from '@expo/vector-icons';
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
  const [request,setRequest]=useState([]);
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
console.log(data)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (organizationId) {
        refetch();
      }
    });

    return unsubscribe;
  }, [navigation, organizationId]);

  if (loading) return <Loading/>
  if (error) return <CustomError title={'Error occured'}/>;

  return (
    <View style={styles.container}>
     {data&&<FlatList 
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
      />}
      {data===undefined&&  <View style={styles.noReqContainer}>
        <Feather name="alert-triangle" size={ms(34)} color={theme.colors.basicColor} />
      <Text style={styles.noReq}>No Requests</Text>
      </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
noReqContainer: {
  flex: 1,
  justifyContent: 'center',  // vertical center
  alignItems: 'center',      // horizontal center
},
noReq: {
  fontSize: 16,
  color: theme.colors.basicColor,
  fontSize:ms(14),
  marginTop:vs(20)
}

});

export default ApproveRequest;
