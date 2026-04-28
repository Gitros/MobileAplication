export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface BrandDto {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  createdAt: string;
}

export interface CategoryDto {
  id: number;
  name: string;
  description?: string;
  iconUrl?: string;
}

export interface TagDto {
  id: number;
  name: string;
}

export interface CustomerDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface AddressDto {
  id: number;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  customerId: number;
}

export interface ProductDto {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  weightGrams?: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  brandId: number;
  brandName: string;
  categoryId: number;
  categoryName: string;
  tags: TagDto[];
}

export interface OrderItemDto {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderDto {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  customerId: number;
  customerName: string;
  shippingAddressId: number;
  shippingAddress: string;
  items: OrderItemDto[];
}

export interface ReviewDto {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  customerId: number;
  customerName: string;
  productId: number;
  productName: string;
}

// Create/Update DTOs
export interface CreateBrandDto { name: string; description?: string; logoUrl?: string }
export interface UpdateBrandDto { name: string; description?: string; logoUrl?: string }
export interface CreateCategoryDto { name: string; description?: string; iconUrl?: string }
export interface UpdateCategoryDto { name: string; description?: string; iconUrl?: string }
export interface CreateTagDto { name: string }
export interface UpdateTagDto { name: string }
export interface CreateCustomerDto { firstName: string; lastName: string; email: string; phone?: string }
export interface UpdateCustomerDto { firstName: string; lastName: string; email: string; phone?: string }
export interface CreateAddressDto { street: string; city: string; postalCode: string; country: string; isDefault: boolean; customerId: number }
export interface UpdateAddressDto { street: string; city: string; postalCode: string; country: string; isDefault: boolean }
export interface CreateProductDto { name: string; description?: string; price: number; stockQuantity: number; weightGrams?: number; imageUrl?: string; brandId: number; categoryId: number; tagIds: number[] }
export interface UpdateProductDto { name: string; description?: string; price: number; stockQuantity: number; weightGrams?: number; imageUrl?: string; isActive: boolean; brandId: number; categoryId: number; tagIds: number[] }
export interface CreateOrderItemDto { productId: number; quantity: number }
export interface CreateOrderDto { notes?: string; customerId: number; shippingAddressId: number; items: CreateOrderItemDto[] }
export interface UpdateOrderStatusDto { status: OrderStatus }
export interface CreateReviewDto { rating: number; comment?: string; customerId: number; productId: number }
export interface UpdateReviewDto { rating: number; comment?: string }
