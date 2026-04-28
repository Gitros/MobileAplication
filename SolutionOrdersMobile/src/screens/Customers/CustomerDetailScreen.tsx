import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCustomer } from '../../api/hooks/useCustomers';
import { useCustomerAddresses } from '../../api/hooks/useAddresses';
import { ErrorView } from '../../components/ErrorView';
import { LoadingView } from '../../components/LoadingView';
import type { CustomersStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<CustomersStackParamList, 'CustomerDetail'>;

export function CustomerDetailScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const { data: customer, isLoading, isError, refetch } = useCustomer(id);
  const { data: addresses } = useCustomerAddresses(id);

  if (isLoading) return <LoadingView />;
  if (isError || !customer) return <ErrorView onRetry={refetch} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Customer Info</Text>
        <Text style={styles.fieldLabel}>Name</Text>
        <Text style={styles.fieldValue}>{customer.firstName} {customer.lastName}</Text>
        <Text style={styles.fieldLabel}>Email</Text>
        <Text style={styles.fieldValue}>{customer.email}</Text>
        {customer.phone && <>
          <Text style={styles.fieldLabel}>Phone</Text>
          <Text style={styles.fieldValue}>{customer.phone}</Text>
        </>}
        <Text style={styles.fieldLabel}>Member since</Text>
        <Text style={styles.fieldValue}>{new Date(customer.createdAt).toLocaleDateString()}</Text>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('CustomerForm', { id })}>
        <Text style={styles.editText}>Edit Customer</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Addresses</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddressList', { customerId: id })}>
            <Text style={styles.link}>Manage</Text>
          </TouchableOpacity>
        </View>
        {!addresses || addresses.length === 0
          ? <Text style={styles.empty}>No addresses</Text>
          : addresses.slice(0, 3).map(a => (
            <View key={a.id} style={styles.addressRow}>
              <Text style={styles.addressText}>{a.street}, {a.city} {a.postalCode}</Text>
              {a.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
            </View>
          ))
        }
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  fieldLabel: { fontSize: 12, color: '#999', marginTop: 8 },
  fieldValue: { fontSize: 15, color: '#1c1c1e' },
  editButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  editText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  link: { color: '#007AFF', fontWeight: '600' },
  empty: { color: '#999', fontStyle: 'italic' },
  addressRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderTopWidth: 1, borderColor: '#f0f0f0' },
  addressText: { flex: 1, fontSize: 14, color: '#333' },
  defaultBadge: { backgroundColor: '#34C759', color: '#fff', fontSize: 11, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
});
