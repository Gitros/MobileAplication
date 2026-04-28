import { Alert } from 'react-native';

export function confirmDelete(name: string, onConfirm: () => void) {
  Alert.alert(
    'Delete',
    `Delete "${name}"? This cannot be undone.`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onConfirm },
    ],
  );
}
