import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2563eb',
    });
  }
  
  return finalStatus === 'granted';
}

export async function scheduleClaimNotification(postTitle: string, claimerName: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "New Claim Request! 🎉",
      body: `${claimerName} has requested to claim your post: "${postTitle}". Check your Claims Inbox.`,
      data: { type: 'claim_request' },
    },
    trigger: null,
  });
}
