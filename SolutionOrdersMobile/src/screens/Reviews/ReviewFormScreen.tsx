import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';
import Toast from 'react-native-toast-message';
import { useReview, useCreateReview, useUpdateReview } from '../../api/hooks/useReviews';
import { useCustomers } from '../../api/hooks/useCustomers';
import { LoadingView } from '../../components/LoadingView';
import { StarRating } from '../../components/StarRating';

const schema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  customerId: z.number().min(1, 'Customer required'),
});
type FormData = z.infer<typeof schema>;

interface Props {
  productId: number;
  reviewId?: number;
  onClose: () => void;
}

export function ReviewFormScreen({ productId, reviewId, onClose }: Props) {
  const isEdit = !!reviewId;
  const { data, isLoading } = useReview(reviewId ?? 0);
  const { data: customers } = useCustomers();
  const create = useCreateReview();
  const update = useUpdateReview();

  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 5, comment: '', customerId: 0 },
  });

  const rating = watch('rating');
  const customerId = watch('customerId');

  useEffect(() => {
    if (data) reset({ rating: data.rating, comment: data.comment ?? '', customerId: data.customerId });
  }, [data]);

  if (isEdit && isLoading) return <LoadingView />;

  const onSubmit = (values: FormData) => {
    if (isEdit) {
      update.mutate({ id: reviewId!, dto: { rating: values.rating, comment: values.comment || undefined } }, {
        onSuccess: () => { Toast.show({ type: 'success', text1: 'Review updated' }); onClose(); },
        onError: () => Toast.show({ type: 'error', text1: 'Update failed' }),
      });
    } else {
      create.mutate({ rating: values.rating, comment: values.comment || undefined, customerId: values.customerId, productId }, {
        onSuccess: () => { Toast.show({ type: 'success', text1: 'Review added' }); onClose(); },
        onError: () => Toast.show({ type: 'error', text1: 'Create failed' }),
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{isEdit ? 'Edit Review' : 'Add Review'}</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Rating *</Text>
      <StarRating value={rating} onChange={v => setValue('rating', v)} />

      {!isEdit && (
        <>
          <Text style={styles.label}>Customer *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.customerBar}>
            {customers?.map(c => (
              <TouchableOpacity
                key={c.id}
                style={[styles.customerChip, customerId === c.id && styles.customerChipActive]}
                onPress={() => setValue('customerId', c.id)}
              >
                <Text style={[styles.customerText, customerId === c.id && styles.customerTextActive]}>
                  {c.firstName} {c.lastName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.customerId && <Text style={styles.error}>{errors.customerId.message}</Text>}
        </>
      )}

      <Text style={styles.label}>Comment</Text>
      <Controller control={control} name="comment" render={({ field: { value, onChange, onBlur } }) => (
        <TextInput style={[styles.input, styles.multiline]} value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Write your review..." multiline numberOfLines={4} />
      )} />

      <TouchableOpacity style={styles.submit} onPress={handleSubmit(onSubmit)} disabled={create.isPending || update.isPending}>
        <Text style={styles.submitText}>{isEdit ? 'Save Review' : 'Submit Review'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '700' },
  cancel: { color: '#FF3B30', fontWeight: '600', fontSize: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
  multiline: { height: 100, textAlignVertical: 'top' },
  error: { color: '#FF3B30', fontSize: 12, marginTop: 2 },
  customerBar: { maxHeight: 48 },
  customerChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 8 },
  customerChipActive: { backgroundColor: '#007AFF' },
  customerText: { fontSize: 14, color: '#555' },
  customerTextActive: { color: '#fff', fontWeight: '600' },
  submit: { backgroundColor: '#007AFF', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
