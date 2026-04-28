import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { z } from 'zod';
import Toast from 'react-native-toast-message';
import { useTag, useCreateTag, useUpdateTag } from '../../api/hooks/useTags';
import { LoadingView } from '../../components/LoadingView';
import type { AdminStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AdminStackParamList, 'TagForm'>;

const schema = z.object({ name: z.string().min(1, 'Name is required').max(50) });
type FormData = z.infer<typeof schema>;

export function TagFormScreen({ navigation, route }: Props) {
  const id = route.params?.id;
  const isEdit = !!id;
  const { data, isLoading } = useTag(id ?? 0);
  const create = useCreateTag();
  const update = useUpdateTag();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  useEffect(() => { if (data) reset({ name: data.name }); }, [data]);

  if (isEdit && isLoading) return <LoadingView />;

  const onSubmit = (values: FormData) => {
    if (isEdit) {
      update.mutate({ id: id!, dto: values }, {
        onSuccess: () => { Toast.show({ type: 'success', text1: 'Tag updated' }); navigation.goBack(); },
        onError: () => Toast.show({ type: 'error', text1: 'Update failed' }),
      });
    } else {
      create.mutate(values, {
        onSuccess: () => { Toast.show({ type: 'success', text1: 'Tag created' }); navigation.goBack(); },
        onError: () => Toast.show({ type: 'error', text1: 'Create failed' }),
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Name *</Text>
      <Controller control={control} name="name" render={({ field: { value, onChange, onBlur } }) => (
        <TextInput style={[styles.input, errors.name && styles.inputError]} value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Tag name" />
      )} />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
      <TouchableOpacity style={styles.submit} onPress={handleSubmit(onSubmit)} disabled={create.isPending || update.isPending}>
        <Text style={styles.submitText}>{isEdit ? 'Save Changes' : 'Create Tag'}</Text>
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
  error: { color: '#FF3B30', fontSize: 12, marginTop: 2 },
  submit: { backgroundColor: '#007AFF', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
