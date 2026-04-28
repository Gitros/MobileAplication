import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTags, useDeleteTag } from '../../api/hooks/useTags';
import { confirmDelete } from '../../components/ConfirmDialog';
import { EmptyView } from '../../components/EmptyView';
import { ErrorView } from '../../components/ErrorView';
import { LoadingView } from '../../components/LoadingView';
import type { AdminStackParamList } from '../../navigation/types';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<AdminStackParamList, 'TagList'>;

export function TagListScreen({ navigation }: Props) {
  const { data, isLoading, isError, refetch } = useTags();
  const deleteTag = useDeleteTag();

  if (isLoading) return <LoadingView />;
  if (isError) return <ErrorView onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('TagForm', {})}>
        <Text style={styles.addText}>+ Add Tag</Text>
      </TouchableOpacity>
      <FlatList
        data={data}
        keyExtractor={i => String(i.id)}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={<EmptyView message="No tags yet" />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => navigation.navigate('TagForm', { id: item.id })}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmDelete(item.name, () =>
                deleteTag.mutate(item.id, {
                  onSuccess: () => Toast.show({ type: 'success', text1: 'Tag deleted' }),
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
  name: { flex: 1, fontSize: 16, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 12 },
  edit: { color: '#007AFF', fontWeight: '600' },
  del: { color: '#FF3B30', fontWeight: '600' },
});
