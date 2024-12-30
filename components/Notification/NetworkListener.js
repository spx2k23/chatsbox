import React, { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { gql, useMutation } from '@apollo/client';

const CHECK_PENDING_NOTIFICATIONS = gql`
  mutation CheckPendingNotifications {
    checkPendingNotifications {
      success
      pendingNotifications {
        type
        sender {
          id
          FirstName
          LastName
          ProfilePicture
          Email
          MobileNumber
        }
        receiverId
        message
      }
    }
  }
`;

const NetworkListener = () => {
  const [checkPendingNotifications] = useMutation(CHECK_PENDING_NOTIFICATIONS);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        checkPendingNotifications()
          .then(response => {
            const { pendingNotifications } = response.data.checkPendingNotifications;
            if (pendingNotifications && pendingNotifications.length > 0) {
              pendingNotifications.forEach(notification => {
                console.log('Pending Notification:', notification);
                
              });
            }
          })
          .catch(error => {
            console.error('Error checking pending notifications:', error);
          });
      }
    });

    return () => unsubscribe();
  }, [checkPendingNotifications]);

  return null;
};

export default NetworkListener;
