import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { OrderStatus } from '../types';

const COLOR_MAP: Record<OrderStatus, string> = {
  Pending: '#FF9500',
  Processing: '#007AFF',
  Shipped: '#5856D6',
  Delivered: '#34C759',
  Cancelled: '#FF3B30',
};

interface Props { status: OrderStatus }

export function StatusBadge({ status }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: COLOR_MAP[status] }]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  text: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
