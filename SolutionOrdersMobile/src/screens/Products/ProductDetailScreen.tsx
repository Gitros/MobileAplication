import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useProduct } from '../../api/hooks/useProducts';
import { useProductReviews, useDeleteReview } from '../../api/hooks/useReviews';
import { ErrorView } from '../../components/ErrorView';
import { LoadingView } from '../../components/LoadingView';
import { StarRating } from '../../components/StarRating';
import { confirmDelete } from '../../components/ConfirmDialog';
import { ReviewFormScreen } from '../Reviews/ReviewFormScreen';
import type { ProductsStackParamList } from '../../navigation/types';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<ProductsStackParamList, 'ProductDetail'>;

export function ProductDetailScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const { data: reviews, refetch: refetchReviews } = useProductReviews(id);
  const deleteReview = useDeleteReview();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editReviewId, setEditReviewId] = useState<number | undefined>();

  if (isLoading) return <LoadingView />;
  if (isError || !product) return <ErrorView onRetry={refetch} />;

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('ProductForm', { id })}>
          <Text style={styles.editText}>Edit Product</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.price}>{product.price.toFixed(2)} PLN</Text>
          {product.description && <Text style={styles.desc}>{product.description}</Text>}

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Brand</Text>
              <Text style={styles.metaValue}>{product.brandName}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Category</Text>
              <Text style={styles.metaValue}>{product.categoryName}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Stock</Text>
              <Text style={[styles.metaValue, product.stockQuantity === 0 && styles.outOfStock]}>{product.stockQuantity}</Text>
            </View>
          </View>

          {product.weightGrams && (
            <Text style={styles.weight}>Weight: {product.weightGrams}g</Text>
          )}

          {product.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {product.tags.map(t => (
                <View key={t.id} style={styles.tag}>
                  <Text style={styles.tagText}>{t.name}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={[styles.statusBadge, { backgroundColor: product.isActive ? '#34C759' : '#FF3B30' }]}>
            <Text style={styles.statusText}>{product.isActive ? 'Active' : 'Inactive'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews ({reviews?.length ?? 0})</Text>
            <TouchableOpacity onPress={() => { setEditReviewId(undefined); setShowReviewForm(true); }}>
              <Text style={styles.link}>+ Add Review</Text>
            </TouchableOpacity>
          </View>
          {!reviews || reviews.length === 0
            ? <Text style={styles.empty}>No reviews yet</Text>
            : reviews.map(r => (
              <View key={r.id} style={styles.reviewRow}>
                <View style={styles.reviewTop}>
                  <Text style={styles.reviewAuthor}>{r.customerName}</Text>
                  <StarRating value={r.rating} readonly />
                </View>
                {r.comment && <Text style={styles.reviewComment}>{r.comment}</Text>}
                <Text style={styles.reviewDate}>{new Date(r.createdAt).toLocaleDateString()}</Text>
                <View style={styles.reviewActions}>
                  <TouchableOpacity onPress={() => { setEditReviewId(r.id); setShowReviewForm(true); }}>
                    <Text style={styles.editSmall}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmDelete('this review', () =>
                    deleteReview.mutate(r.id, {
                      onSuccess: () => { refetchReviews(); Toast.show({ type: 'success', text1: 'Review deleted' }); },
                      onError: () => Toast.show({ type: 'error', text1: 'Delete failed' }),
                    })
                  )}>
                    <Text style={styles.delSmall}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          }
        </View>
      </ScrollView>

      <Modal visible={showReviewForm} animationType="slide" presentationStyle="pageSheet">
        <ReviewFormScreen
          productId={id}
          reviewId={editReviewId}
          onClose={() => { setShowReviewForm(false); refetchReviews(); }}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  editButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  editText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12 },
  productName: { fontSize: 22, fontWeight: '700', color: '#1c1c1e' },
  price: { fontSize: 20, color: '#007AFF', fontWeight: '700', marginTop: 4 },
  desc: { fontSize: 14, color: '#555', marginTop: 8, lineHeight: 20 },
  metaRow: { flexDirection: 'row', marginTop: 16, gap: 12 },
  metaItem: { flex: 1 },
  metaLabel: { fontSize: 11, color: '#999' },
  metaValue: { fontSize: 14, fontWeight: '600', color: '#1c1c1e', marginTop: 2 },
  outOfStock: { color: '#FF3B30' },
  weight: { fontSize: 13, color: '#666', marginTop: 8 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  tag: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagText: { color: '#5856D6', fontSize: 12, fontWeight: '600' },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  link: { color: '#007AFF', fontWeight: '600' },
  empty: { color: '#999', fontStyle: 'italic' },
  reviewRow: { borderTopWidth: 1, borderColor: '#f0f0f0', paddingTop: 12, marginTop: 8 },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewAuthor: { fontSize: 14, fontWeight: '600' },
  reviewComment: { fontSize: 14, color: '#333', marginTop: 4 },
  reviewDate: { fontSize: 11, color: '#999', marginTop: 4 },
  reviewActions: { flexDirection: 'row', gap: 12, marginTop: 6 },
  editSmall: { color: '#007AFF', fontSize: 13 },
  delSmall: { color: '#FF3B30', fontSize: 13 },
});
