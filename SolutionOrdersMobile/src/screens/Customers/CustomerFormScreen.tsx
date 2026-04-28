import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { z } from 'zod';
import Toast from 'react-native-toast-message';
import { useCustomer, useCreateCustomer, useUpdateCustomer } from '../../api/hooks/useCustomers';
import { LoadingView } from '../../components/LoadingView';
import type { CustomersStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<CustomersStackParamList, 'CustomerForm'>;

const schema = z.object({
  firstName: z.string().min(1, 'First name required').max(50),
  lastName: z.string().min(1, 'Last name required').max(50),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function CustomerFormScreen({ navigation, route }: Props) {
  const id = route.params?.id;
  const isEdit = !!id;
  const { data, isLoading } = useCustomer(id ?? 0);
  const create = useCreateCustomer();
  const update = useUpdateCustomer();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '' },
  });

  useEffect(() => {
    if (data) reset({ firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone ?? '' });
  }, [data]);

  if (isEdit && isLoading) return <LoadingView />;

  const onSubmit = (values: FormData) => {
    const dto = { ...values, phone: values.phone || undefined };
    if (isEdit) {
      update.mutate({ id: id!, dto }, {
        onSuccess: () => { Toast.show({ type: 'success', text1: 'Customer updated' }); navigation.goBack(); },
        onError: () => Toast.show({ type: 'error', text1: 'Update failed' }),
      });
    } else {
      create.mutate(dto, {
        onSuccess: () => { Toast.show({ type: 'success', text1: 'Customer created' }); navigation.goBack(); },
        onError: () => Toast.show({ type: 'error', text1: 'Create failed' }),
      });
    }
  };

  const Field = ({ name, label, placeholder, keyboardType, autoCapitalize }: any) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <Controller control={control} name={name} render={({ field: { value, onChange, onBlur } }) => (
        <TextInput style={[styles.input, (errors as any)[name] && styles.inputError]} value={value} onChangeText={onChange} onBlur={onBlur} placeholder={placeholder} keyboardType={keyboardType} autoCapitalize={autoCapitalize} />
      )} />
      {(errors as any)[name] && <Text style={styles.error}>{(errors as any)[name].message}</Text>}
    </>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Field name="firstName" label="First Name *" placeholder="Anna" />
      <Field name="lastName" label="Last Name *" placeholder="Smith" />
      <Field name="email" label="Email *" placeholder="anna@example.com" keyboardType="email-address" autoCapitalize="none" />
      <Field name="phone" label="Phone" placeholder="+48 123 456 789" keyboardType="phone-pad" />
      <TouchableOpacity style={styles.submit} onPress={handleSubmit(onSubmit)} disabled={create.isPending || update.isPending}>
        <Text style={styles.submitText}>{isEdit ? 'Save Changes' : 'Create Customer'}</Text>
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
