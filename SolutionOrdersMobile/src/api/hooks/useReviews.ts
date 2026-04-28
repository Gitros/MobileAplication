import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { ReviewDto, CreateReviewDto, UpdateReviewDto } from '../../types';

export const useReviews = () =>
  useQuery({ queryKey: ['reviews'], queryFn: () => api.get<ReviewDto[]>('/reviews').then(r => r.data) });

export const useReview = (id: number) =>
  useQuery({ queryKey: ['reviews', id], queryFn: () => api.get<ReviewDto>(`/reviews/${id}`).then(r => r.data), enabled: !!id });

export const useProductReviews = (productId: number) =>
  useQuery({ queryKey: ['reviews', 'product', productId], queryFn: () => api.get<ReviewDto[]>(`/reviews/product/${productId}`).then(r => r.data), enabled: !!productId });

export const useCreateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateReviewDto) => api.post<ReviewDto>('/reviews', dto).then(r => r.data),
    onSuccess: (_, dto) => {
      qc.invalidateQueries({ queryKey: ['reviews'] });
      qc.invalidateQueries({ queryKey: ['reviews', 'product', dto.productId] });
    },
  });
};

export const useUpdateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateReviewDto }) =>
      api.put<ReviewDto>(`/reviews/${id}`, dto).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews'] }),
  });
};

export const useDeleteReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/reviews/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews'] }),
  });
};
