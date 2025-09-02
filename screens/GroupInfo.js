import React, { useState } from "react";
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
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { s, vs, ms } from "react-native-size-matters";

const GroupInfo = () => {
  const route = useRoute();
  const { data } = route.params;
  const navigation = useNavigation();

  const [selectedMember, setSelectedMember] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [groupName, setGroupName] = useState(data.name);
  const [groupImage, setGroupImage] = useState(data.image);

  const handleMemberAction = (action) => {
    console.log(`${action} ->`, selectedMember?.name);
    setModalVisible(false);
  };

  const handleSaveGroup = () => {
    console.log("Updated Group:", { groupName, groupImage });
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
        data={data.members}
        keyExtractor={(item, index) => item.userId + index}
        renderItem={renderMember}
        contentContainerStyle={{ paddingHorizontal: s(16) }}
      />

      {/* Bottom actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerBtn}>
          <Ionicons name="person-add" size={ms(18)} color="#fff" />
          <Text style={styles.footerBtnText}>Add Member</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.footerBtn, { backgroundColor: "#E53935" }]}>
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
