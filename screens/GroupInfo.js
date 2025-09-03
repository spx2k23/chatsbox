import React, { useState , useEffect,} from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { s, vs, ms } from "react-native-size-matters";
import { useQuery, gql, useApolloClient } from '@apollo/client';
import { useSQLiteContext } from 'expo-sqlite';
import theme from "../config/theme";
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

const GroupInfo = () => {
    const client = useApolloClient();
    const [organizationId, setOrganizationId] = useState(null);
    const [userId, setUserId] = useState(null);
      const [users, setUsers] = useState([]);
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
      
  const route = useRoute();
  const { groupMembers} = route.params;
  const navigation = useNavigation();

  const [selectedMember, setSelectedMember] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);


  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState(groupMembers.name);
  const [groupImage, setGroupImage] = useState(groupMembers.image);

  const availableUsers = users.filter(
    (u) => !groupMembers.members.some((m) => m.userId === u.id)
  );

const handleLeaveGroup = () => {
  console.log("User confirmed to leave the group");
  setLeaveModalVisible(false);

};
  const handleMemberAction = (action) => {
    // console.log(`${action} ->`, selectedMember?.name);
    setModalVisible(false);
  };
const toggleSelectUser = (user) => {
  if (selectedUsers.some((u) => u.id === user.id)) {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
  } else {
    setSelectedUsers([...selectedUsers, user]);
  }
};

const handleAddSelectedMembers = () => {
  // console.log("Selected Members to Add:", selectedUsers);

  setSelectedUsers([]);
  setAddMemberModalVisible(false);
};

  const handleSaveGroup = () => {
    // console.log("Updated Group:", { groupName, groupImage });
    setEditModalVisible(false);
  };

  const renderMember = ({ item }) => (
    <View style={styles.memberCard}>
      <Image source={{ uri: item.profileImg }} style={styles.memberImg} />
      <View style={{ flex: 1 }}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberRole}>{item.role}</Text>
      </View>
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() => {
          setSelectedMember(item);
          setModalVisible(true);
        }}
      >
        <MaterialIcons name="more-vert" size={ms(20)} color="#444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={ms(24)} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Group Info</Text>
      </View>

      {/* Group profile */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: groupImage }} style={styles.profileImg} />
        <Text style={styles.profileName}>{groupName}</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setEditModalVisible(true)}
        >
          <MaterialCommunityIcons name="pencil" size={ms(16)} color="#fff" />
          <Text style={styles.editText}>Edit Group</Text>
        </TouchableOpacity>
      </View>

      {/* Members section */}
      <Text style={styles.sectionTitle}>Members</Text>
      <FlatList
        data={groupMembers.members}
        keyExtractor={(item, index) => item.userId + index}
        renderItem={renderMember}
        contentContainerStyle={{ paddingHorizontal: s(16) }}
      />

      {/* Bottom actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerBtn} onPress={() => setAddMemberModalVisible(true)}>
          <Ionicons name="person-add" size={ms(18)} color="#fff" />
          <Text style={styles.footerBtnText}>Add Member</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.footerBtn, { backgroundColor: "#E53935" }]} onPress={() => setLeaveModalVisible(true)}>
          <MaterialIcons name="exit-to-app" size={ms(18)} color="#fff" />
          <Text style={styles.footerBtnText}>Leave Group</Text>
        </TouchableOpacity>
      </View>

      {/* Member Management Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Manage {selectedMember?.name}
            </Text>

            {selectedMember?.role === "Member" ? (
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => handleMemberAction("Promote to Admin")}
              >
                <Ionicons name="arrow-up-circle" size={ms(18)} color="#6200EE" />
                <Text style={styles.modalBtnText}>Promote to Admin</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => handleMemberAction("Demote to Member")}
              >
                <Ionicons name="arrow-down-circle" size={ms(18)} color="#6200EE" />
                <Text style={styles.modalBtnText}>Demote to Member</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => handleMemberAction("Remove from Group")}
            >
              <MaterialIcons name="person-remove" size={ms(18)} color="#E53935" />
              <Text style={[styles.modalBtnText, { color: "#E53935" }]}>
                Remove from Group
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, { justifyContent: "center" }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#444", fontSize: ms(13), fontWeight: "500" }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Edit Group Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setEditModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Group</Text>

            <TouchableOpacity
              style={{ alignSelf: "center", marginBottom: vs(12) }}
              onPress={() => console.log("Change Image clicked")}
            >
              <Image
                source={{ uri: groupImage }}
                style={{ width: ms(90), height: ms(90), borderRadius: ms(45) }}
              />
              <Text style={{ textAlign: "center", color: "#6200EE", marginTop: vs(6) }}>
                Change Image
              </Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Enter group name"
              value={groupName}
              onChangeText={setGroupName}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveGroup}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, { justifyContent: "center" }]}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={{ color: "#444", fontSize: ms(15), fontWeight: "500" }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
            {/* Add Member Modal */}
      {/* Add Member Modal */}
<Modal
  visible={addMemberModalVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setAddMemberModalVisible(false)}
>
  <Pressable style={styles.modalOverlay} onPress={() => setAddMemberModalVisible(false)}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Add Members</Text>

      {availableUsers.length === 0 ? (
        <Text style={{ textAlign: "center", color: "#777", marginVertical: vs(10) }}>
          All contacts are already in this group.
        </Text>
      ) : (
        <FlatList
          data={availableUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = selectedUsers.some((u) => u.id === item.id);
            return (
              <TouchableOpacity
                style={[
                  styles.memberCard,
                  { backgroundColor: isSelected ? "#E8EAF6" : "#f9f9f9" },
                ]}
                onPress={() => toggleSelectUser(item)}
              >
                <Image
                  source={{ uri: `data:image/jpeg;base64,${item.ProfilePicture}` }}
                  style={styles.memberImg}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.memberName}>
                    {item.FirstName} {item.LastName}
                  </Text>
                  <Text style={styles.memberRole}>{item.Role}</Text>
                </View>
                {isSelected ? (
                  <Ionicons name="checkmark-circle" size={ms(20)} color="#6200EE" />
                ) : (
                  <Ionicons name="ellipse-outline" size={ms(20)} color="#aaa" />
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}

      {selectedUsers.length > 0 && (
        <TouchableOpacity style={styles.saveBtn} onPress={handleAddSelectedMembers}>
          <Text style={styles.saveBtnText}>
            Add {selectedUsers.length} Member{selectedUsers.length > 1 ? "s" : ""}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.modalBtn, { justifyContent: "center", marginTop: vs(8) }]}
        onPress={() => {
          setSelectedUsers([]);
          setAddMemberModalVisible(false);
        }}
      >
        <Text style={{ color: "#444", fontSize: ms(13), fontWeight: "500" }}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  </Pressable>
</Modal>
{/* Leave Group Confirmation Modal */}
<Modal
  visible={leaveModalVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setLeaveModalVisible(false)}
>
  <Pressable style={styles.modalOverlay} onPress={() => setLeaveModalVisible(false)}>
    <View style={[styles.modalContent, {  alignItems: "center",paddingBottom:Platform.OS==='ios'?ms(25):ms(20) }]}>
      <Text style={[styles.modalTitle, { fontSize: ms(15), textAlign: "center",marginBottom:0 }]}>
        Are you sure you want to leave this group?
      </Text>

      <View style={{ flexDirection: "row", marginTop: vs(16) }}>
        <TouchableOpacity
          style={[
            styles.footerBtn,
            {  backgroundColor: "#E53935" ,textAlign:'center',paddingHorizontal:s(20)},
          ]}
          onPress={handleLeaveGroup}
        >
          <Text style={styles.footerBtnText}>Leave</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.footerBtn,
            { marginLeft: s(10), backgroundColor: theme.colors.basicColor,textAlign:'center',paddingHorizontal:s(20) },
          ]}
          onPress={() => setLeaveModalVisible(false)}
        >
          <Text style={styles.footerBtnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Pressable>
</Modal>


    </View>
  );
};

export default GroupInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6200EE",
    paddingVertical: vs(14),
    paddingHorizontal: s(16),
    elevation: 4,
  },
  headerText: {
    color: "#fff",
    fontSize: ms(18),
    fontWeight: "600",
    marginLeft: s(16),
    paddingTop:vs(30)
  },

  profileContainer: {
    alignItems: "center",
    paddingVertical: vs(20),
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  profileImg: {
    width: ms(70),
    height: ms(70),
    borderRadius: ms(35),
    marginBottom: vs(10),
  },
  profileName: {
    fontSize: ms(20),
    fontWeight: "600",
    color: "#333",
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6200EE",
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    marginTop: vs(8),
  },
  editText: {
    color: "#fff",
    marginLeft: s(6),
    fontSize: ms(12),
    fontWeight: "500",
  },

  sectionTitle: {
    fontSize: ms(14),
    fontWeight: "600",
    marginTop: vs(14),
    marginBottom: vs(8),
    paddingHorizontal: s(16),
    color: "#6200EE",
  },

  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: ms(12),
    borderRadius: ms(12),
    marginBottom: vs(10),
  },
  memberImg: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    marginRight: s(12),
  },
  memberName: {
    fontSize: ms(14),
    fontWeight: "600",
    color: "#333",
  },
  memberRole: {
    fontSize: ms(11),
    color: "#666",
  },
  actionBtn: {
    padding: ms(4),
    borderRadius: ms(8),
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: s(16),
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fafafa",
    marginBottom:vs(6)
  },
  footerBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6200EE",
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    borderRadius: ms(25),
  },
  footerBtnText: {
    color: "#fff",
    marginLeft: s(6),
    fontSize: ms(12),
    fontWeight: "500",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    padding: ms(20),
  },
  modalTitle: {
    fontSize: ms(14),
    fontWeight: "600",
    marginBottom: vs(12),
    color: "#333",
  },
  modalBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: vs(12),
  },
  modalBtnText: {
    marginLeft: s(10),
    fontSize: ms(13),
    fontWeight: "500",
    color: "#333",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: ms(10),
    padding: ms(10),
    marginBottom: vs(16),
    fontSize: ms(12),
  },

  saveBtn: {
    backgroundColor: "#6200EE",
    borderRadius: ms(25),
    paddingVertical: vs(10),
    alignItems: "center",
    marginBottom: vs(10),
  },
  saveBtnText: {
    color: "#fff",
    fontSize: ms(14),
    fontWeight: "600",
  },
});
