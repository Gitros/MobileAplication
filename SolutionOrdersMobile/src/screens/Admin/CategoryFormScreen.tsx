import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { z } from 'zod';
import Toast from 'react-native-toast-message';
import { useCategory, useCreateCategory, useUpdateCategory } from '../../api/hooks/useCategories';
import { LoadingView } from '../../components/LoadingView';
import type { AdminStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AdminStackParamList, 'CategoryForm'>;

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
  iconUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});
type FormData = z.infer<typeof schema>;

export function CategoryFormScreen({ navigation, route }: Props) {
  const id = route.params?.id;
  const isEdit = !!id;
  const { data, isLoading } = useCategory(id ?? 0);
  const create = useCreateCategory();
  const update = useUpdateCategory();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', iconUrl: '' },
  });

  useEffect(() => {
    if (data) reset({ name: data.name, description: data.description ?? '', iconUrl: data.iconUrl ?? '' });
  }, [data]);

  if (isEdit && isLoading) return <LoadingView />;

  const onSubmit = (values: FormData) => {
    const dto = { name: values.name, description: values.description || undefined, iconUrl: values.iconUrl || undefined };
    if (isEdit) {
      update.mutate({ id: id!, dto }, {
        onSuccess: () => { Toast.show({ type: 'success', text1: 'Category updated' }); navigation.goBack(); },
        onError: () => Toast.show({ type: 'error', text1: 'Update failed' }),
      });
    } else {
      create.mutate(dto, {
        onSuccess: () => { Toast.show({ type: 'success', text1: 'Category created' }); navigation.goBack(); },
        onError: () => Toast.show({ type: 'error', text1: 'Create failed' }),
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Name *</Text>
      <Controller control={control} name="name" render={({ field: { value, onChange, onBlur } }) => (
        <TextInput style={[styles.input, errors.name && styles.inputError]} value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Category name" />
      )} />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <Text style={styles.label}>Description</Text>
      <Controller control={control} name="description" render={({ field: { value, onChange, onBlur } }) => (
        <TextInput style={[styles.input, styles.multiline]} value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Optional description" multiline numberOfLines={3} />
      )} />

      <Text style={styles.label}>Icon URL</Text>
      <Controller control={control} name="iconUrl" render={({ field: { value, onChange, onBlur } }) => (
        <TextInput style={[styles.input, errors.iconUrl && styles.inputError]} value={value} onChangeText={onChange} onBlur={onBlur} placeholder="https://..." autoCapitalize="none" />
      )} />
      {errors.iconUrl && <Text style={styles.error}>{errors.iconUrl.message}</Text>}

      <TouchableOpacity style={styles.submit} onPress={handleSubmit(onSubmit)} disabled={create.isPending || update.isPending}>
        <Text style={styles.submitText}>{isEdit ? 'Save Changes' : 'Create Category'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4, marginTop: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
  inputError: { borderColor: '#FF3B30' },
  multiline: { height: 80, textAlignVertical: 'top' },
  error: { color: '#FF3B30', fontSize: 12, marginTop: 2 },
  submit: { backgroundColor: '#007AFF', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
