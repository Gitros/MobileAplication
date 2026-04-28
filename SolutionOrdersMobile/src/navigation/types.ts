export type AdminStackParamList = {
  AdminHome: undefined;
  BrandList: undefined;
  BrandForm: { id?: number };
  CategoryList: undefined;
  CategoryForm: { id?: number };
  TagList: undefined;
  TagForm: { id?: number };
};

export type ProductsStackParamList = {
  ProductList: undefined;
  ProductDetail: { id: number };
  ProductForm: { id?: number };
};

export type CustomersStackParamList = {
  CustomerList: undefined;
  CustomerDetail: { id: number };
  CustomerForm: { id?: number };
  AddressList: { customerId: number };
  AddressForm: { customerId: number; id?: number };
};

export type OrdersStackParamList = {
  OrderList: undefined;
  OrderDetail: { id: number };
  CreateOrder: undefined;
};

export type RootTabParamList = {
  Products: undefined;
  Orders: undefined;
  Customers: undefined;
  Admin: undefined;
};
