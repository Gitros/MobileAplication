import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { AddressDto, CreateAddressDto, UpdateAddressDto } from '../../types';

export const useAddresses = () =>
  useQuery({ queryKey: ['addresses'], queryFn: () => api.get<AddressDto[]>('/addresses').then(r => r.data) });

export const useAddress = (id: number) =>
  useQuery({ queryKey: ['addresses', id], queryFn: () => api.get<AddressDto>(`/addresses/${id}`).then(r => r.data), enabled: !!id });

export const useCustomerAddresses = (customerId: number) =>
  useQuery({ queryKey: ['addresses', 'customer', customerId], queryFn: () => api.get<AddressDto[]>(`/addresses/customer/${customerId}`).then(r => r.data), enabled: !!customerId });

export const useCreateAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateAddressDto) => api.post<AddressDto>('/addresses', dto).then(r => r.data),
    onSuccess: (_, dto) => {
      qc.invalidateQueries({ queryKey: ['addresses'] });
      qc.invalidateQueries({ queryKey: ['addresses', 'customer', dto.customerId] });
    },
  });
};

export const useUpdateAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateAddressDto }) =>
      api.put<AddressDto>(`/addresses/${id}`, dto).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  });
};

export const useDeleteAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/addresses/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  });
};
