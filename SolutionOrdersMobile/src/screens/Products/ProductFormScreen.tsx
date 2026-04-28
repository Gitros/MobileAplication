import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import { z } from 'zod';
import Toast from 'react-native-toast-message';
import { useProduct, useCreateProduct, useUpdateProduct } from '../../api/hooks/useProducts';
import { useBrands } from '../../api/hooks/useBrands';
import { useCategories } from '../../api/hooks/useCategories';
import { useTags } from '../../api/hooks/useTags';
import { LoadingView } from '../../components/LoadingView';
import type { ProductsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProductsStackParamList, 'ProductForm'>;

const schema = z.object({
  name: z.string().min(1, 'Name required').max(200),
  description: z.string().optional(),
  price: z.string().min(1, 'Price required'),
  stockQuantity: z.string().min(1, 'Stock required'),
  weightGrams: z.string().optional(),
  imageUrl: z.string().optional(),
  brandId: z.number().min(1, 'Brand required'),
  categoryId: z.number().min(1, 'Category required'),
  tagIds: z.array(z.number()),
  isActive: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

export function ProductFormScreen({ navigation, route }: Props) {
  const id = route.params?.id;
  const isEdit = !!id;
  const { data, isLoading } = useProduct(id ?? 0);
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();
  const { data: tags } = useTags();
  const create = useCreateProduct();
  const update = useUpdateProduct();

  const [showBrandPicker, setShowBrandPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', price: '', stockQuantity: '', weightGrams: '', imageUrl: '', brandId: 0, categoryId: 0, tagIds: [], isActive: true },
  });

  const brandId = watch('brandId');
  const categoryId = watch('categoryId');
  const selectedBrand = brands?.find(b => b.id === brandId);
  const selectedCategory = categories?.find(c => c.id === categoryId);

  useEffect(() => {
    if (data) {
      const tagIds = data.tags.map(t => t.id);
      reset({
        name: data.name,
        description: data.description ?? '',
        price: String(data.price),
        stockQuantity: String(data.stockQuantity),
        weightGrams: data.weightGrams ? String(data.weightGrams) : '',
        imageUrl: data.imageUrl ?? '',
        brandId: data.brandId,
        categoryId: data.categoryId,
        tagIds,
        isActive: data.isActive,
      });
      setSelectedTagIds(tagIds);
    }
  }, [data]);

  useEffect(() => { setValue('tagIds', selectedTagIds); }, [selectedTagIds]);

  if (isEdit && isLoading) return <LoadingView />;

  const toggleTag = (tagId: number) => {
    setSelectedTagIds(prev => prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]);
  };

  const onSubmit = (values: FormData) => {
    const price = parseFloat(values.price);
    const stockQuantity = parseInt(values.stockQuantity, 10);
    if (isNaN(price) || price <= 0) { Toast.show({ type: 'error', text1: 'Price must be a positive number' }); return; }
    if (isNaN(stockQuantity) || stockQuantity < 0) { Toast.show({ type: 'error', text1: 'Stock must be a non-negative integer' }); return; }
    const dto = {
      name: values.name,
      description: values.description || undefined,
      price,
      stockQuantity,
      weightGrams: values.weightGrams ? parseInt(values.weightGrams, 10) : undefined,
      imageUrl: values.imageUrl || undefined,
      brandId: values.brandId,
      categoryId: values.categoryId,
      tagIds: selectedTagIds,
    };
    if (isEdit) {
      update.mutate({ id: id!, dto: { ...dto, isActive: values.isActive ?? true } }, {
        onSuccess: () => { Toast.show({ type: 'success', text1: 'Product updated' }); navigation.goBack(); },
        onError: () => Toast.show({ type: 'error', text1: 'Update failed' }),
      });
    } else {
      create.mutate(dto, {
        onSuccess: () => { Toast.show({ type: 'success', text1: 'Product created' }); navigation.goBack(); },
        onError: () => Toast.show({ type: 'error', text1: 'Create failed' }),
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Name *</Text>
      <Controller control={control} name="name" render={({ field: { value, onChange, onBlur } }) => (
        <TextInput style={[styles.input, errors.name && styles.inputError]} value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Product name" />
      )} />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <Text style={styles.label}>Description</Text>
      <Controller control={control} name="description" render={({ field: { value, onChange, onBlur } }) => (
        <TextInput style={[styles.input, styles.multiline]} value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Optional description" multiline numberOfLines={3} />
      )} />

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Price (PLN) *</Text>
          <Controller control={control} name="price" render={({ field: { value, onChange, onBlur } }) => (
            <TextInput style={[styles.input, errors.price && styles.inputError]} value={String(value)} onChangeText={onChange} onBlur={onBlur} keyboardType="decimal-pad" placeholder="0.00" />
          )} />
          {errors.price && <Text style={styles.error}>{errors.price.message}</Text>}
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Stock *</Text>
          <Controller control={control} name="stockQuantity" render={({ field: { value, onChange, onBlur } }) => (
            <TextInput style={[styles.input, errors.stockQuantity && styles.inputError]} value={String(value)} onChangeText={onChange} onBlur={onBlur} keyboardType="numeric" placeholder="0" />
          )} />
          {errors.stockQuantity && <Text style={styles.error}>{errors.stockQuantity.message}</Text>}
        </View>
      </View>

      <Text style={styles.label}>Weight (grams)</Text>
      <Controller control={control} name="weightGrams" render={({ field: { value, onChange, onBlur } }) => (
        <TextInput style={styles.input} value={String(value)} onChangeText={onChange} onBlur={onBlur} keyboardType="numeric" placeholder="Optional" />
      )} />

      <Text style={styles.label}>Image URL</Text>
      <Controller control={control} name="imageUrl" render={({ field: { value, onChange, onBlur } }) => (
        <TextInput style={styles.input} value={value} onChangeText={onChange} onBlur={onBlur} placeholder="https://..." autoCapitalize="none" />
      )} />

      <Text style={styles.label}>Brand *</Text>
      <TouchableOpacity style={[styles.picker, errors.brandId && styles.inputError]} onPress={() => setShowBrandPicker(true)}>
        <Text style={selectedBrand ? styles.pickerText : styles.pickerPlaceholder}>
          {selectedBrand?.name ?? 'Select brand...'}
        </Text>
      </TouchableOpacity>
      {errors.brandId && <Text style={styles.error}>{errors.brandId.message}</Text>}

      <Text style={styles.label}>Category *</Text>
      <TouchableOpacity style={[styles.picker, errors.categoryId && styles.inputError]} onPress={() => setShowCategoryPicker(true)}>
        <Text style={selectedCategory ? styles.pickerText : styles.pickerPlaceholder}>
          {selectedCategory?.name ?? 'Select category...'}
        </Text>
      </TouchableOpacity>
      {errors.categoryId && <Text style={styles.error}>{errors.categoryId.message}</Text>}

      <Text style={styles.label}>Tags</Text>
      <View style={styles.tagsGrid}>
        {tags?.map(t => (
          <TouchableOpacity key={t.id} style={[styles.tagChip, selectedTagIds.includes(t.id) && styles.tagChipActive]} onPress={() => toggleTag(t.id)}>
            <Text style={[styles.tagText, selectedTagIds.includes(t.id) && styles.tagTextActive]}>{t.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submit} onPress={handleSubmit(onSubmit)} disabled={create.isPending || update.isPending}>
        <Text style={styles.submitText}>{isEdit ? 'Save Changes' : 'Create Product'}</Text>
      </TouchableOpacity>

      {/* Brand Picker Modal */}
      <Modal visible={showBrandPicker} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Brand</Text>
            <TouchableOpacity onPress={() => setShowBrandPicker(false)}>
              <Text style={styles.modalClose}>Done</Text>
            </TouchableOpacity>
          </View>
          <FlatList data={brands} keyExtractor={b => String(b.id)} renderItem={({ item }) => (
            <TouchableOpacity style={[styles.modalItem, brandId === item.id && styles.modalItemActive]} onPress={() => { setValue('brandId', item.id); setShowBrandPicker(false); }}>
              <Text style={styles.modalItemText}>{item.name}</Text>
            </TouchableOpacity>
          )} />
        </View>
      </Modal>

      {/* Category Picker Modal */}
      <Modal visible={showCategoryPicker} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
              <Text style={styles.modalClose}>Done</Text>
            </TouchableOpacity>
          </View>
          <FlatList data={categories} keyExtractor={c => String(c.id)} renderItem={({ item }) => (
            <TouchableOpacity style={[styles.modalItem, categoryId === item.id && styles.modalItemActive]} onPress={() => { setValue('categoryId', item.id); setShowCategoryPicker(false); }}>
              <Text style={styles.modalItemText}>{item.name}</Text>
            </TouchableOpacity>
          )} />
        </View>
      </Modal>
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
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  picker: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12 },
  pickerText: { fontSize: 16, color: '#1c1c1e' },
  pickerPlaceholder: { fontSize: 16, color: '#aaa' },
  tagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  tagChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ddd' },
  tagChipActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  tagText: { fontSize: 14, color: '#555' },
  tagTextActive: { color: '#fff', fontWeight: '600' },
  submit: { backgroundColor: '#007AFF', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#e0e0e0' },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalClose: { color: '#007AFF', fontWeight: '600', fontSize: 16 },
  modalItem: { padding: 16, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  modalItemActive: { backgroundColor: '#EEF6FF' },
  modalItemText: { fontSize: 16 },
});
