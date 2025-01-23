import React, { useEffect, useState, useRef } from "react";
import { useSubscription, gql } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useSQLiteContext } from "expo-sqlite";
import * as Notifications from "expo-notifications";

const NOTIFICATION_SUBSCRIPTION = gql`
  subscription Notification($userId: ID!) {
    notification(userId: $userId) {
      type
      userId
      user {
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

const NotificationListener = () => {
  const db = useSQLiteContext();
  const [userId, setUserId] = useState(null);
  const userIdRef = useRef(null); // Use ref to store userId

  const getUserId = async () => {
    const token = await AsyncStorage.getItem('token');
    const decoded = jwtDecode(token);
    setUserId(decoded.id);
    userIdRef.current = decoded.id; // Update ref
  };

  useEffect(() => {
    getUserId();
  }, []);

  // Subscription hook
  const { data, loading, error } = useSubscription(NOTIFICATION_SUBSCRIPTION, {
    variables: { userId: userIdRef.current }, // Use ref for userId
    skip: !userIdRef.current, // Only subscribe once the userId is available
  });

  useEffect(() => {
    if (loading || error) return; // Handle loading and error states

    if (!data?.notification) return;

    const handleNotification = async () => {
      const { type, user } = data.notification;

      if (type === "ACCEPT_FRIEND_REQUEST") {
        await db.runAsync(
          `INSERT INTO friends (userId, firstName, lastName, role, dateOfBirth, profilePicture, bio, email, phoneNumber) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(userId) DO NOTHING;`,
          [user.id, user.FirstName, user.LastName, user.Role, user.DateOfBirth, user.ProfilePicture, user.Bio, user.Email, user.MobileNumber]
        );
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Friend Request Accepted",
            body: `${user.FirstName} ${user.LastName} has accepted your friend request`,
          },
          trigger: null,
        });
      } else if (type === "SEND_FRIEND_REQUEST") {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Friend Request",
            body: `${user.FirstName} ${user.LastName} sent you a friend request`,
          },
          trigger: null,
        });
      }
    };

    handleNotification();

    // Cleanup logic - Unsubscribe from subscription manually when userId changes or component unmounts
    return () => {
      console.log("Cleaning up subscriptions");
      // If using Apollo Client, you can call unsubscribe here if needed
    };
  }, [data, loading, error, db]);

  return null;
};

export default NotificationListener;