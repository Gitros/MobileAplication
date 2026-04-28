import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props { message?: string }

export function EmptyView({ message = 'No items found' }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  text: { fontSize: 16, color: '#999', textAlign: 'center' },
});
