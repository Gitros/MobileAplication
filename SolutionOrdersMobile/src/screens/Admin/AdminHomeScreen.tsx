import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { AdminStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminHome'>;

export function AdminHomeScreen({ navigation }: Props) {
  const items = [
    { label: 'Brands', screen: 'BrandList' as const, desc: 'Manage supplement brands' },
    { label: 'Categories', screen: 'CategoryList' as const, desc: 'Manage product categories' },
    { label: 'Tags', screen: 'TagList' as const, desc: 'Manage product tags' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Admin Panel</Text>
      {items.map(item => (
        <TouchableOpacity key={item.screen} style={styles.card} onPress={() => navigation.navigate(item.screen)}>
          <Text style={styles.cardTitle}>{item.label}</Text>
          <Text style={styles.cardDesc}>{item.desc}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#1c1c1e' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#1c1c1e' },
  cardDesc: { fontSize: 14, color: '#666', marginTop: 4 },
});
