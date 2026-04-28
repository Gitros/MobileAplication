import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDeleteBrand, useBrands } from '../../api/hooks/useBrands';
import { confirmDelete } from '../../components/ConfirmDialog';
import { EmptyView } from '../../components/EmptyView';
import { ErrorView } from '../../components/ErrorView';
import { LoadingView } from '../../components/LoadingView';
import type { AdminStackParamList } from '../../navigation/types';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<AdminStackParamList, 'BrandList'>;

export function BrandListScreen({ navigation }: Props) {
  const { data, isLoading, isError, refetch } = useBrands();
  const deleteBrand = useDeleteBrand();

  if (isLoading) return <LoadingView />;
  if (isError) return <ErrorView onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('BrandForm', {})}>
        <Text style={styles.addText}>+ Add Brand</Text>
      </TouchableOpacity>
      <FlatList
        data={data}
        keyExtractor={i => String(i.id)}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={<EmptyView message="No brands yet" />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              {item.description ? <Text style={styles.sub}>{item.description}</Text> : null}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => navigation.navigate('BrandForm', { id: item.id })}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmDelete(item.name, () =>
                deleteBrand.mutate(item.id, {
                  onSuccess: () => Toast.show({ type: 'success', text1: 'Brand deleted' }),
                  onError: () => Toast.show({ type: 'error', text1: 'Delete failed' }),
                })
              )}>
                <Text style={styles.del}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  name: { fontSize: 16, fontWeight: '600' },
  sub: { fontSize: 13, color: '#666', marginTop: 2 },
  actions: { flexDirection: 'row', gap: 12 },
  edit: { color: '#007AFF', fontWeight: '600' },
  del: { color: '#FF3B30', fontWeight: '600' },
});
