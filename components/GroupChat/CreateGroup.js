import { Text,View  ,StyleSheet, TouchableOpacity,Platform,TextInput,FlatList} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../../config/theme";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState} from 'react';
import { useQuery, gql } from '@apollo/client';
import { useSQLiteContext } from 'expo-sqlite';
import CreateGroupMemberBox from "./CreateGroupMemberBox";
const isIosPlatform = Platform.OS === 'ios';


const GET_USERS_IN_ORG = gql`
  query GetUsersInOrganization($organizationId: ID!) {
    getUsersInOrganization(organizationId: $organizationId) {
      id
      FirstName
      LastName
      Email
      Role  
      ProfilePicture
    }
  }
`;
const CreateGroup=()=>{
    const navigation = useNavigation();
    const [users, setUsers] = useState([]);
    const [organizationId, setOrganizationId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [selectedMembers,setSelectedMembers]=useState([]);
    const db = useSQLiteContext();
    useEffect(() => {
        const fetchOrgAndUser  = async () => {
          try {
            const firstRow = await db.getFirstAsync(`SELECT * FROM user`);
            // if(isIosPlatform)  console.log('Database First Row:', firstRow);
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
        onError: (error) => {
            console.error('GraphQL Query Error:', error); // Log any errors
          },
      });
//  console.log(users);
 

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
    return matchesSearch ;
  });

  
  const isIdPresent = (id) => {
    return selectedMembers.includes(id); // Works for arrays of strings or numbers
  };
    return(
        <View style={styles.container}>
            <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={24} color={theme.colors.basicColor} />
            </TouchableOpacity>
            <View style={styles.subheader}>
            <Text style={styles.title}>Create Group</Text>
            <Text style={styles.subtitle}>Add members to start group</Text>
            </View>
          </View>
          <View  style={styles.searchBar}>
          <MaterialIcons name="search" size={24} color="black" />
            <TextInput
                style={styles.searchBarInput}
                placeholder="Search..."
                value={searchText}
                onChangeText={setSearchText}
            />
         </View>
         {filteredUsers.length === 0 && searchText !== '' && (
        <Text style={styles.nomatch}>No matching data</Text>
      )}
         <FlatList
        contentContainerStyle={styles.flatListContainer}
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
        
            return (
              <CreateGroupMemberBox
                firstName={item.FirstName}
                lastName={item.LastName}
                email={item.Email}
                role={item.Role}
                bio={item.Bio}
                id={item.id}
                image={item.ProfilePicture}
                userId={userId}
                selectedMembers={selectedMembers}
                setSelectedMembers={setSelectedMembers}
                isSelected={isIdPresent(item.id)}
              />
            );
         
        }}
      />
        </View>
    )
}

export default CreateGroup;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingBottom:70
    },
    header: {
      flexDirection: 'row',
    //   alignItems: 'center',
      marginBottom: 5,
      paddingTop: isIosPlatform ? 60 : 30,
      paddingBottom: 10,
      width: '100%',
      paddingHorizontal: 10,
      backgroundColor: '#fff',
    },
    subheader:{
        marginLeft:15,
    },
    title:{
        fontSize:22,
        fontWeight:500,
        marginBottom:5
    },
    subtitle:{
        fontSize:14,
        color:theme.colors.basicColor
    },
     searchBar: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10, // Horizontal padding
    paddingVertical: Platform.OS === 'ios' ? 10 : 0, // Vertical padding (force 0 for Android)
    margin: 0, // Remove any default margins
    lineHeight: Platform.OS === 'android' ? 20 : undefined, // Adjust line height for Android
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'center', // Align text vertically (Android-specific)
    includeFontPadding: false, // Disable extra font padding (Android-specific)
    width:'96%',
    alignSelf:'center',
    flexDirection:'row',
    alignItems:'center'
  },
      searchBarInput:{
       marginLeft:isIosPlatform?5:0
      }
});