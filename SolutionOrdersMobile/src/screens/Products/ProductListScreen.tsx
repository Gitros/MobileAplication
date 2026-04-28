import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useProducts, useProductsByCategory, useDeleteProduct } from '../../api/hooks/useProducts';
import { useCategories } from '../../api/hooks/useCategories';
import { confirmDelete } from '../../components/ConfirmDialog';
import { EmptyView } from '../../components/EmptyView';
import { ErrorView } from '../../components/ErrorView';
import { LoadingView } from '../../components/LoadingView';
import type { ProductsStackParamList } from '../../navigation/types';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<ProductsStackParamList, 'ProductList'>;

export function ProductListScreen({ navigation }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { data: categories } = useCategories();
  const all = useProducts();
  const byCat = useProductsByCategory(selectedCategory ?? 0);
  const { data, isLoading, isError, refetch } = selectedCategory ? byCat : all;
  const deleteProduct = useDeleteProduct();

  if (isLoading) return <LoadingView />;
  if (isError) return <ErrorView onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterContent}>
        <TouchableOpacity style={[styles.chip, !selectedCategory && styles.chipActive]} onPress={() => setSelectedCategory(null)}>
          <Text style={[styles.chipText, !selectedCategory && styles.chipTextActive]}>All</Text>
        </TouchableOpacity>
        {categories?.map(c => (
          <TouchableOpacity key={c.id} style={[styles.chip, selectedCategory === c.id && styles.chipActive]} onPress={() => setSelectedCategory(c.id)}>
            <Text style={[styles.chipText, selectedCategory === c.id && styles.chipTextActive]}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('ProductForm', {})}>
        <Text style={styles.addText}>+ Add Product</Text>
      </TouchableOpacity>

      <FlatList
        data={data}
        keyExtractor={i => String(i.id)}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={<EmptyView message="No products found" />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('ProductDetail', { id: item.id })}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sub}>{item.brandName} · {item.categoryName}</Text>
              <Text style={styles.price}>{item.price.toFixed(2)} PLN</Text>
            </View>
            <View style={styles.right}>
              <Text style={[styles.stock, item.stockQuantity === 0 && styles.outOfStock]}>
                Stock: {item.stockQuantity}
              </Text>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => navigation.navigate('ProductForm', { id: item.id })}>
                  <Text style={styles.edit}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDelete(item.name, () =>
                  deleteProduct.mutate(item.id, {
                    onSuccess: () => Toast.show({ type: 'success', text1: 'Product deleted' }),
                    onError: () => Toast.show({ type: 'error', text1: 'Delete failed' }),
                  })
                )}>
                  <Text style={styles.del}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  filterBar: { maxHeight: 52, borderBottomWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#fff' },
  filterContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f0f0f0' },
  chipActive: { backgroundColor: '#007AFF' },
  chipText: { fontSize: 14, color: '#555' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  addButton: { margin: 16, backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' },
  addText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  row: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 8 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600' },
  sub: { fontSize: 13, color: '#666', marginTop: 2 },
  price: { fontSize: 15, color: '#007AFF', fontWeight: '600', marginTop: 4 },
  right: { alignItems: 'flex-end', justifyContent: 'space-between' },
  stock: { fontSize: 12, color: '#34C759' },
  outOfStock: { color: '#FF3B30' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  edit: { color: '#007AFF', fontWeight: '600' },
  del: { color: '#FF3B30', fontWeight: '600' },
});
