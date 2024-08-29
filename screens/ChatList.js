import { Text, View, ScrollView, StyleSheet } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { jwtDecode } from "jwt-decode";

const ChatList = () => {
    const navigation = useNavigation();
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
        
        </ScrollView>
    );
};

export default ChatList;