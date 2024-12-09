import React, { useEffect } from "react";
import { useSubscription } from "@apollo/client";
import * as Notifications from "expo-notifications";

const NOTIFICATION_SUBSCRIPTION = gql`
  subscription Notification($receiverId: ID!) {
    notification(receiverId: $receiverId) {
      type
      sender
      receiverId
    }
  }
`;

const NotificationListener = () => {

  const [UserId, setUserId] = useState();
  const getUserId = async () => {
      const token = await AsyncStorage.getItem('token');
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
  };

  useEffect(() => {
    getUserId();
  }, []);

  const { data } = useSubscription(NOTIFICATION_SUBSCRIPTION, {
    variables: { receiverId: UserId },
  });

  useEffect(() => {
    const { type } = data.notification;
    if (data.type === "FRIEND_REQUEST_ACCEPT") {
      db.runAsync(
        `INSERT INTO friends (userId, name, profilePicture, email, phoneNumber) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(userId) DO NOTHING;`,
        [sender.id, sender.Name, sender.ProfilePicture, sender.Email, sender.MobileNumber]
      )
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Friend Request Accepted",
          body: "accepted",
        },
        trigger: null,
      });
    } else {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Friend Request",
          body: "request",
        },
        trigger: null,
      });
    }
  }, [data]);

  return null;
};

export default NotificationListener;
