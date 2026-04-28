import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useOrders, useDeleteOrder } from '../../api/hooks/useOrders';
import { confirmDelete } from '../../components/ConfirmDialog';
import { EmptyView } from '../../components/EmptyView';
import { ErrorView } from '../../components/ErrorView';
import { LoadingView } from '../../components/LoadingView';
import { StatusBadge } from '../../components/StatusBadge';
import type { OrdersStackParamList } from '../../navigation/types';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<OrdersStackParamList, 'OrderList'>;

export function OrderListScreen({ navigation }: Props) {
  const { data, isLoading, isError, refetch } = useOrders();
  const deleteOrder = useDeleteOrder();

  if (isLoading) return <LoadingView />;
  if (isError) return <ErrorView onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateOrder')}>
        <Text style={styles.addText}>+ New Order</Text>
      </TouchableOpacity>
      <FlatList
        data={data}
        keyExtractor={i => String(i.id)}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={<EmptyView message="No orders yet" />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('OrderDetail', { id: item.id })}>
            <View style={styles.info}>
              <Text style={styles.orderNum}>{item.orderNumber}</Text>
              <Text style={styles.customer}>{item.customerName}</Text>
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            <View style={styles.right}>
              <StatusBadge status={item.status} />
              <Text style={styles.total}>{item.totalAmount.toFixed(2)} PLN</Text>
              <TouchableOpacity onPress={() => confirmDelete(item.orderNumber, () =>
                deleteOrder.mutate(item.id, {
                  onSuccess: () => Toast.show({ type: 'success', text1: 'Order deleted' }),
                  onError: () => Toast.show({ type: 'error', text1: 'Delete failed' }),
                })
              )}>
                <Text style={styles.del}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  addButton: { margin: 16, backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' },
  addText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  row: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 8, alignItems: 'center' },
  info: { flex: 1 },
  orderNum: { fontSize: 16, fontWeight: '700' },
  customer: { fontSize: 13, color: '#555', marginTop: 2 },
  date: { fontSize: 12, color: '#999', marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 6 },
  total: { fontSize: 15, fontWeight: '600', color: '#1c1c1e' },
  del: { color: '#FF3B30', fontWeight: '600', fontSize: 13 },
});
