import React, { useEffect, useState, useCallback } from 'react';
import { View ,StyleSheet, Text,TextInput,FlatList} from "react-native";
import { useQuery, gql, useApolloClient } from '@apollo/client';
import Loading from "../Loading/Loading";
import CustomNotFound from "../NotFound";
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import {MaterialIcons } from "@expo/vector-icons";
import ManageUserBox from './ManageUserBox';


const GET_USERS_IN_ORG = gql`
  query GetUsersInOrganization($organizationId: ID!) {
    getUsersInOrganization(organizationId: $organizationId) {
      id
      FirstName
      LastName
      Role
      ProfilePicture
      Email
    }
  }
`;

const ManageUsers=()=>{

    const db = useSQLiteContext();
    const [organizationId, setOrganizationId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [users, setUsers] = useState([]);
    const [userModal,setUserModal]=useState(false);

    const filteredUsers = users.filter(user => {
        const searchTokens = searchText
          .toLowerCase()
          .split(' ')
          .filter(token => token.trim() !== ''); // Split into tokens and remove empty strings
      
        // Check if all tokens are present in at least one of the user's fields
        return searchTokens.every(token => 
          user.FirstName?.toLowerCase().includes(token) ||
          user.SecondName?.toLowerCase().includes(token) ||
          user.Email?.toLowerCase().includes(token) ||
          user.Role?.toLowerCase().includes(token)
        );
      });
    //   console.log(filteredUsers);
      
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
  if (loading) {
    return <Loading/>;
  }

  if (error) {
    return <CustomNotFound title={'Error Occured'} />;
  }

  if (!data || !data.getUsersInOrganization) {
    return <CustomNotFound title={'No data available'} />;
  }

    return(
        <View style={styles.container}>
           
            <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={24} color="grey" />
                    <TextInput
                        placeholder="Search..."
                        value={searchText}
                        onChangeText={setSearchText}
                    />
            </View>
            <FlatList
        contentContainerStyle={styles.flatListContainer}
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
            return(
                <ManageUserBox
                firstName={item.FirstName}
                lastName={item.LastName}
                role={item.Role}
                image={item.ProfilePicture}
                userId={userId}
                userRights={'Member'}
                setUserModal={setUserModal}
                userModal={userModal}
                />

            )
        }
         }
      />
      
       </View>
    );
}

export default ManageUsers;

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    },
    searchContainer:{
        flexDirection:'row',
        alignItems:'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 6,
        width: '98%',  
        alignSelf: 'center',
        letterSpacing:10,
        paddingLeft:10,
        minHeight:40
    },
  
})