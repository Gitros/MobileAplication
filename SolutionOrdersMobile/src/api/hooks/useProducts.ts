import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { ProductDto, CreateProductDto, UpdateProductDto } from '../../types';

export const useProducts = () =>
  useQuery({ queryKey: ['products'], queryFn: () => api.get<ProductDto[]>('/products').then(r => r.data) });

export const useProductsByCategory = (categoryId: number) =>
  useQuery({ queryKey: ['products', 'category', categoryId], queryFn: () => api.get<ProductDto[]>(`/products/category/${categoryId}`).then(r => r.data), enabled: !!categoryId });

export const useProduct = (id: number) =>
  useQuery({ queryKey: ['products', id], queryFn: () => api.get<ProductDto>(`/products/${id}`).then(r => r.data), enabled: !!id });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateProductDto) => api.post<ProductDto>('/products', dto).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateProductDto }) =>
      api.put<ProductDto>(`/products/${id}`, dto).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};
