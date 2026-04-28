import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { useOrder, useUpdateOrderStatus } from '../../api/hooks/useOrders';
import { ErrorView } from '../../components/ErrorView';
import { LoadingView } from '../../components/LoadingView';
import { StatusBadge } from '../../components/StatusBadge';
import type { OrdersStackParamList } from '../../navigation/types';
import type { OrderStatus } from '../../types';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<OrdersStackParamList, 'OrderDetail'>;

const STATUSES: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export function OrderDetailScreen({ route }: Props) {
  const { id } = route.params;
  const { data: order, isLoading, isError, refetch } = useOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const [showStatusModal, setShowStatusModal] = useState(false);

  if (isLoading) return <LoadingView />;
  if (isError || !order) return <ErrorView onRetry={refetch} />;

  const changeStatus = (status: OrderStatus) => {
    updateStatus.mutate({ id, dto: { status } }, {
      onSuccess: () => { refetch(); Toast.show({ type: 'success', text1: `Status updated to ${status}` }); setShowStatusModal(false); },
      onError: () => Toast.show({ type: 'error', text1: 'Update failed' }),
    });
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.orderNum}>{order.orderNumber}</Text>
              <Text style={styles.date}>{new Date(order.createdAt).toLocaleDateString()}</Text>
            </View>
            <StatusBadge status={order.status} />
          </View>
          <TouchableOpacity style={styles.statusBtn} onPress={() => setShowStatusModal(true)}>
            <Text style={styles.statusBtnText}>Change Status</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Customer</Text>
          <Text style={styles.value}>{order.customerName}</Text>
          <Text style={styles.label}>Shipping Address</Text>
          <Text style={styles.value}>{order.shippingAddress}</Text>
          {order.notes && <>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.value}>{order.notes}</Text>
          </>}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items ({order.items.length})</Text>
          {order.items.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.productName}</Text>
                <Text style={styles.itemSub}>Qty: {item.quantity} × {item.unitPrice.toFixed(2)} PLN</Text>
              </View>
              <Text style={styles.itemTotal}>{(item.quantity * item.unitPrice).toFixed(2)} PLN</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{order.totalAmount.toFixed(2)} PLN</Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showStatusModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.statusSheet}>
            <Text style={styles.sheetTitle}>Update Status</Text>
            {STATUSES.map(s => (
              <TouchableOpacity key={s} style={[styles.statusOption, order.status === s && styles.statusOptionActive]} onPress={() => changeStatus(s)}>
                <StatusBadge status={s} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowStatusModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderNum: { fontSize: 20, fontWeight: '700' },
  date: { fontSize: 13, color: '#999', marginTop: 2 },
  statusBtn: { marginTop: 12, backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8, alignItems: 'center' },
  statusBtnText: { fontWeight: '600', color: '#333' },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  label: { fontSize: 12, color: '#999', marginTop: 8 },
  value: { fontSize: 14, color: '#1c1c1e' },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderColor: '#f0f0f0' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600' },
  itemSub: { fontSize: 12, color: '#666', marginTop: 2 },
  itemTotal: { fontSize: 14, fontWeight: '600' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 2, borderColor: '#e0e0e0', marginTop: 8 },
  totalLabel: { fontSize: 16, fontWeight: '700' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#007AFF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  statusSheet: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20 },
  sheetTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  statusOption: { padding: 12, borderRadius: 8, marginBottom: 8, alignItems: 'flex-start' },
  statusOptionActive: { backgroundColor: '#f0f0f0' },
  cancelBtn: { marginTop: 8, padding: 12, alignItems: 'center' },
  cancelText: { color: '#FF3B30', fontWeight: '600', fontSize: 16 },
});
