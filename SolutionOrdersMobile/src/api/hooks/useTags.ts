import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { TagDto, CreateTagDto, UpdateTagDto } from '../../types';

export const useTags = () =>
  useQuery({ queryKey: ['tags'], queryFn: () => api.get<TagDto[]>('/tags').then(r => r.data) });

export const useTag = (id: number) =>
  useQuery({ queryKey: ['tags', id], queryFn: () => api.get<TagDto>(`/tags/${id}`).then(r => r.data), enabled: !!id });

export const useCreateTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateTagDto) => api.post<TagDto>('/tags', dto).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tags'] }),
  });
};

export const useUpdateTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateTagDto }) =>
      api.put<TagDto>(`/tags/${id}`, dto).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tags'] }),
  });
};

export const useDeleteTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/tags/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tags'] }),
  });
};
