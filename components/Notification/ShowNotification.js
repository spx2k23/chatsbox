import PushNotification from 'react-native-push-notification';

const showLocalNotification = (message) => {
  PushNotification.localNotification({
    message,
    playSound: true,
    soundName: 'default',
    importance: 'high',
    vibrate: true,
  });
};

export default showLocalNotification;
