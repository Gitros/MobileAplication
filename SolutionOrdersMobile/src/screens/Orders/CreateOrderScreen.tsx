import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useCustomers } from '../../api/hooks/useCustomers';
import { useCustomerAddresses } from '../../api/hooks/useAddresses';
import { useProducts } from '../../api/hooks/useProducts';
import { useCreateOrder } from '../../api/hooks/useOrders';
import { useCartStore } from '../../store/cartStore';
import { LoadingView } from '../../components/LoadingView';
import type { OrdersStackParamList } from '../../navigation/types';
import type { CustomerDto, AddressDto, ProductDto } from '../../types';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<OrdersStackParamList, 'CreateOrder'>;

type Step = 'customer' | 'address' | 'products' | 'confirm';

export function CreateOrderScreen({ navigation }: Props) {
  const [step, setStep] = useState<Step>('customer');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDto | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<AddressDto | null>(null);
  const [notes, setNotes] = useState('');

  const { data: customers, isLoading: loadingCustomers } = useCustomers();
  const { data: addresses, isLoading: loadingAddresses } = useCustomerAddresses(selectedCustomer?.id ?? 0);
  const { data: products, isLoading: loadingProducts } = useProducts();
  const createOrder = useCreateOrder();
  const { items, addItem, removeItem, updateQuantity, clear } = useCartStore();

  const getQty = (productId: number) => items.find(i => i.productId === productId)?.quantity ?? 0;

  const cartTotal = items.reduce((sum, item) => {
    const product = products?.find(p => p.id === item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

  const submit = () => {
    if (!selectedCustomer || !selectedAddress || items.length === 0) return;
    createOrder.mutate({
      customerId: selectedCustomer.id,
      shippingAddressId: selectedAddress.id,
      notes: notes || undefined,
      items,
    }, {
      onSuccess: (order) => {
        clear();
        Toast.show({ type: 'success', text1: `Order ${order.orderNumber} created!` });
        navigation.replace('OrderDetail', { id: order.id });
      },
      onError: () => Toast.show({ type: 'error', text1: 'Failed to create order' }),
    });
  };

  const stepLabels: Record<Step, string> = { customer: '1. Customer', address: '2. Address', products: '3. Products', confirm: '4. Confirm' };
  const steps: Step[] = ['customer', 'address', 'products', 'confirm'];

  return (
    <View style={styles.container}>
      {/* Step indicator */}
      <View style={styles.stepBar}>
        {steps.map(s => (
          <View key={s} style={[styles.stepItem, step === s && styles.stepItemActive]}>
            <Text style={[styles.stepText, step === s && styles.stepTextActive]}>{stepLabels[s]}</Text>
          </View>
        ))}
      </View>

      {/* Step: Customer */}
      {step === 'customer' && (
        loadingCustomers ? <LoadingView /> :
        <FlatList
          data={customers}
          keyExtractor={c => String(c.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.selectRow, selectedCustomer?.id === item.id && styles.selectRowActive]}
              onPress={() => { setSelectedCustomer(item); setSelectedAddress(null); setStep('address'); }}
            >
              <Text style={styles.selectName}>{item.firstName} {item.lastName}</Text>
              <Text style={styles.selectSub}>{item.email}</Text>
            </TouchableOpacity>
          )}
          ListHeaderComponent={<Text style={styles.stepTitle}>Select Customer</Text>}
        />
      )}

      {/* Step: Address */}
      {step === 'address' && (
        loadingAddresses ? <LoadingView /> :
        <FlatList
          data={addresses}
          keyExtractor={a => String(a.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.selectRow, selectedAddress?.id === item.id && styles.selectRowActive]}
              onPress={() => { setSelectedAddress(item); setStep('products'); }}
            >
              <Text style={styles.selectName}>{item.street}</Text>
              <Text style={styles.selectSub}>{item.postalCode} {item.city}, {item.country}</Text>
              {item.isDefault && <Text style={styles.defaultTag}>Default</Text>}
            </TouchableOpacity>
          )}
          ListHeaderComponent={
            <View>
              <Text style={styles.stepTitle}>Select Shipping Address</Text>
              <TouchableOpacity onPress={() => setStep('customer')} style={styles.backBtn}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
            </View>
          }
          ListEmptyComponent={<Text style={styles.emptyText}>No addresses for this customer. Add one first.</Text>}
        />
      )}

      {/* Step: Products */}
      {step === 'products' && (
        loadingProducts ? <LoadingView /> :
        <View style={styles.flex}>
          <FlatList
            data={products}
            keyExtractor={p => String(p.id)}
            ListHeaderComponent={
              <View>
                <Text style={styles.stepTitle}>Add Products</Text>
                <TouchableOpacity onPress={() => setStep('address')} style={styles.backBtn}>
                  <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
              </View>
            }
            renderItem={({ item }) => {
              const qty = getQty(item.id);
              return (
                <View style={styles.productRow}>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>{item.price.toFixed(2)} PLN</Text>
                  </View>
                  <View style={styles.qtyControl}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => qty > 0 ? (qty === 1 ? removeItem(item.id) : updateQuantity(item.id, qty - 1)) : null}>
                      <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qty}>{qty}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => qty === 0 ? addItem(item.id, 1) : updateQuantity(item.id, qty + 1)}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
          {items.length > 0 && (
            <TouchableOpacity style={styles.nextBtn} onPress={() => setStep('confirm')}>
              <Text style={styles.nextText}>Continue ({items.length} items) →</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Step: Confirm */}
      {step === 'confirm' && (
        <ScrollView contentContainerStyle={styles.confirmContent}>
          <Text style={styles.stepTitle}>Confirm Order</Text>
          <TouchableOpacity onPress={() => setStep('products')} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Customer</Text>
            <Text style={styles.summaryValue}>{selectedCustomer?.firstName} {selectedCustomer?.lastName}</Text>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>{selectedAddress?.street}, {selectedAddress?.city}</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Items</Text>
            {items.map(item => {
              const product = products?.find(p => p.id === item.productId);
              return (
                <View key={item.productId} style={styles.confirmItem}>
                  <Text style={styles.confirmItemName}>{product?.name ?? `Product #${item.productId}`}</Text>
                  <Text style={styles.confirmItemDetail}>{item.quantity} × {product?.price.toFixed(2)} PLN = {((product?.price ?? 0) * item.quantity).toFixed(2)} PLN</Text>
                </View>
              );
            })}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{cartTotal.toFixed(2)} PLN</Text>
            </View>
          </View>

          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput style={[styles.input, styles.multiline]} value={notes} onChangeText={setNotes} placeholder="Order notes..." multiline numberOfLines={3} />

          <TouchableOpacity style={styles.submitBtn} onPress={submit} disabled={createOrder.isPending}>
            <Text style={styles.submitText}>{createOrder.isPending ? 'Creating...' : 'Place Order'}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  flex: { flex: 1 },
  stepBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e0e0e0' },
  stepItem: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  stepItemActive: { borderBottomWidth: 2, borderColor: '#007AFF' },
  stepText: { fontSize: 11, color: '#999' },
  stepTextActive: { color: '#007AFF', fontWeight: '700' },
  stepTitle: { fontSize: 20, fontWeight: '700', padding: 16, paddingBottom: 8 },
  backBtn: { paddingHorizontal: 16, paddingBottom: 8 },
  backText: { color: '#007AFF', fontWeight: '600' },
  selectRow: { backgroundColor: '#fff', marginHorizontal: 16, marginVertical: 4, padding: 14, borderRadius: 10, borderWidth: 2, borderColor: 'transparent' },
  selectRowActive: { borderColor: '#007AFF' },
  selectName: { fontSize: 16, fontWeight: '600' },
  selectSub: { fontSize: 13, color: '#666', marginTop: 2 },
  defaultTag: { color: '#34C759', fontSize: 12, fontWeight: '600', marginTop: 4 },
  emptyText: { padding: 16, color: '#999', textAlign: 'center' },
  productRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 10 },
  productInfo: { flex: 1 },
  productName: { fontSize: 15, fontWeight: '600' },
  productPrice: { fontSize: 13, color: '#007AFF', marginTop: 2 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { color: '#fff', fontSize: 18, fontWeight: '700', lineHeight: 20 },
  qty: { fontSize: 16, fontWeight: '700', minWidth: 24, textAlign: 'center' },
  nextBtn: { margin: 16, backgroundColor: '#34C759', padding: 14, borderRadius: 10, alignItems: 'center' },
  nextText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  confirmContent: { padding: 16 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12 },
  summaryLabel: { fontSize: 12, color: '#999', marginTop: 8 },
  summaryValue: { fontSize: 15, fontWeight: '600', color: '#1c1c1e' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  confirmItem: { paddingVertical: 6, borderTopWidth: 1, borderColor: '#f0f0f0' },
  confirmItemName: { fontSize: 14, fontWeight: '600' },
  confirmItemDetail: { fontSize: 13, color: '#666', marginTop: 2 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 2, borderColor: '#e0e0e0', marginTop: 8 },
  totalLabel: { fontSize: 16, fontWeight: '700' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#007AFF' },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4, marginTop: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
  multiline: { height: 80, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: '#007AFF', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 17 },
});
