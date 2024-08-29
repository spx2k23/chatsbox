import { Text, View, ScrollView, StyleSheet } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { jwtDecode } from "jwt-decode";

const ChatList = () => {
    const navigation = useNavigation();
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    const styles = StyleSheet.create({
        headerLeftText: {
            fontSize: 18,
            fontWeight: "bold",
            padding: 10,
            marginLeft: 10,
            color:'#fff'
        },
        headerRightContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            marginRight: 10,
            
        },
        icon: {
            color:'#fff'
        },
    });

    useLayoutEffect(() => {
        const setHeaderOptions = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (token && typeof token === "string") {
                    const decodedToken = jwtDecode(token);
                    const superAdminStatus = decodedToken.superAdmin;
                    setIsSuperAdmin(superAdminStatus);

                    navigation.setOptions({
                        headerTitle: "",
                        headerLeft: () => (
                            <Text style={styles.headerLeftText}>Chat List</Text>
                        ),
                        headerRight: () => (
                            <View style={styles.headerRightContainer}>
                                <MaterialIcons
                                    onPress={() => navigation.navigate("Users")}
                                    name="person-add-alt"
                                    style={styles.icon}
                                    size={22}
                                />
                                <MaterialIcons
                                    onPress={() => navigation.navigate("Friends")}
                                    name="people-outline"
                                    style={styles.icon}
                                    size={22}
                                />
                                {isSuperAdmin && (
                                    <MaterialIcons
                                        onPress={() => navigation.navigate("ApproveRequests")}
                                        name="check-circle-outline"
                                        style={styles.icon}
                                        size={22}
                                    />
                                )}
                                <MaterialIcons
                                    onPress={() => { AsyncStorage.removeItem("token"); navigation.navigate("Login") }}
                                    name="logout"
                                    style={styles.icon}
                                    size={22}
                                />
                            </View>
                        ),
                    });
                } else {
                    navigation.navigate("Login");
                }
            } catch (error) {
                navigation.navigate("Login");
            }
        };

        setHeaderOptions();
    }, [navigation]);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
        </ScrollView>
    );
};

export default ChatList;