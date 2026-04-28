import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';
import Toast from 'react-native-toast-message';
import { useAddress, useCreateAddress, useUpdateAddress } from '../../api/hooks/useAddresses';
import { LoadingView } from '../../components/LoadingView';
import type { CustomersStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<CustomersStackParamList, 'AddressForm'>;

const schema = z.object({
  street: z.string().min(1, 'Street required'),
  city: z.string().min(1, 'City required'),
  postalCode: z.string().min(1, 'Postal code required'),
  country: z.string().min(1, 'Country required'),
  isDefault: z.boolean(),
});
type FormData = z.infer<typeof schema>;

export function AddressFormScreen({ navigation, route }: Props) {
  const { customerId, id } = route.params;
  const isEdit = !!id;
  const { data, isLoading } = useAddress(id ?? 0);
  const create = useCreateAddress();
  const update = useUpdateAddress();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { street: '', city: '', postalCode: '', country: 'Poland', isDefault: false },
  });

  useEffect(() => {
    if (data) reset({ street: data.street, city: data.city, postalCode: data.postalCode, country: data.country, isDefault: data.isDefault });
  }, [data]);

  if (isEdit && isLoading) return <LoadingView />;

  const onSubmit = (values: FormData) => {
    if (isEdit) {
      update.mutate({ id: id!, dto: values }, {
        onSuccess: () => { Toast.show({ type: 'success', text1: 'Address updated' }); navigation.goBack(); },
        onError: () => Toast.show({ type: 'error', text1: 'Update failed' }),
      });
    } else {
      create.mutate({ ...values, customerId }, {
        onSuccess: () => { Toast.show({ type: 'success', text1: 'Address created' }); navigation.goBack(); },
        onError: () => Toast.show({ type: 'error', text1: 'Create failed' }),
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {(['street', 'city', 'postalCode', 'country'] as const).map(field => (
        <React.Fragment key={field}>
          <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)} *</Text>
          <Controller control={control} name={field} render={({ field: { value, onChange, onBlur } }) => (
            <TextInput style={[styles.input, errors[field] && styles.inputError]} value={value as string} onChangeText={onChange} onBlur={onBlur} placeholder={field} />
          )} />
          {errors[field] && <Text style={styles.error}>{errors[field]?.message}</Text>}
        </React.Fragment>
      ))}

      <View style={styles.switchRow}>
        <Text style={styles.label}>Default address</Text>
        <Controller control={control} name="isDefault" render={({ field: { value, onChange } }) => (
          <Switch value={value} onValueChange={onChange} />
        )} />
      </View>

      <TouchableOpacity style={styles.submit} onPress={handleSubmit(onSubmit)} disabled={create.isPending || update.isPending}>
        <Text style={styles.submitText}>{isEdit ? 'Save Changes' : 'Create Address'}</Text>
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
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  submit: { backgroundColor: '#007AFF', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
