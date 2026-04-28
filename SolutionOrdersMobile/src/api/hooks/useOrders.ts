import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { OrderDto, CreateOrderDto, UpdateOrderStatusDto } from '../../types';

export const useOrders = () =>
  useQuery({ queryKey: ['orders'], queryFn: () => api.get<OrderDto[]>('/orders').then(r => r.data) });

export const useOrder = (id: number) =>
  useQuery({ queryKey: ['orders', id], queryFn: () => api.get<OrderDto>(`/orders/${id}`).then(r => r.data), enabled: !!id });

export const useCustomerOrders = (customerId: number) =>
  useQuery({ queryKey: ['orders', 'customer', customerId], queryFn: () => api.get<OrderDto[]>(`/orders/customer/${customerId}`).then(r => r.data), enabled: !!customerId });

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateOrderDto) => api.post<OrderDto>('/orders', dto).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateOrderStatusDto }) =>
      api.patch(`/orders/${id}/status`, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
};

export const useDeleteOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/orders/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
};
