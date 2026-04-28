import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { BrandDto, CreateBrandDto, UpdateBrandDto } from '../../types';

export const useBrands = () =>
  useQuery({ queryKey: ['brands'], queryFn: () => api.get<BrandDto[]>('/brands').then(r => r.data) });

export const useBrand = (id: number) =>
  useQuery({ queryKey: ['brands', id], queryFn: () => api.get<BrandDto>(`/brands/${id}`).then(r => r.data), enabled: !!id });

export const useCreateBrand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateBrandDto) => api.post<BrandDto>('/brands', dto).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['brands'] }),
  });
};

export const useUpdateBrand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateBrandDto }) =>
      api.put<BrandDto>(`/brands/${id}`, dto).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['brands'] }),
  });
};

export const useDeleteBrand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/brands/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['brands'] }),
  });
};
