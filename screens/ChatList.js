import { Text, View, ScrollView } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { jwtDecode } from "jwt-decode";

const ChatList = () => {
    
    const navigation = useNavigation();
    const [isSuperAdmin, setIsSuperAdmin] = useState('false');

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
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Chat List</Text>
                        ),
                        headerRight: () => (
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                <MaterialIcons
                                    onPress={() => navigation.navigate("Users")}
                                    name="person-add-alt"
                                    size={24}
                                    color="black"
                                />
                                <MaterialIcons
                                    onPress={() => navigation.navigate("Friends")}
                                    name="people-outline"
                                    size={24}
                                    color="black"
                                />
                                {isSuperAdmin && (
                                    <MaterialIcons
                                        onPress={() => navigation.navigate("ApproveRequests")}
                                        name="check-circle-outline"
                                        size={24}
                                        color="black"
                                    />
                                )}
                                <MaterialIcons
                                    onPress={() => { AsyncStorage.removeItem("token"); navigation.navigate("Login") }}
                                    name="logout"
                                    size={24}
                                    color="black"
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
