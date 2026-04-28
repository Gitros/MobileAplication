import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from '../../types';

export const useCategories = () =>
  useQuery({ queryKey: ['categories'], queryFn: () => api.get<CategoryDto[]>('/categories').then(r => r.data) });

export const useCategory = (id: number) =>
  useQuery({ queryKey: ['categories', id], queryFn: () => api.get<CategoryDto>(`/categories/${id}`).then(r => r.data), enabled: !!id });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCategoryDto) => api.post<CategoryDto>('/categories', dto).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateCategoryDto }) =>
      api.put<CategoryDto>(`/categories/${id}`, dto).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/categories/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
};
