import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { CustomerDto, CreateCustomerDto, UpdateCustomerDto } from '../../types';

export const useCustomers = () =>
  useQuery({ queryKey: ['customers'], queryFn: () => api.get<CustomerDto[]>('/customers').then(r => r.data) });

export const useCustomer = (id: number) =>
  useQuery({ queryKey: ['customers', id], queryFn: () => api.get<CustomerDto>(`/customers/${id}`).then(r => r.data), enabled: !!id });

export const useCreateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCustomerDto) => api.post<CustomerDto>('/customers', dto).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
  });
};

export const useUpdateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateCustomerDto }) =>
      api.put<CustomerDto>(`/customers/${id}`, dto).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
  });
};

export const useDeleteCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/customers/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
  });
};
