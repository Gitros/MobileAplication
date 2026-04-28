import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text } from 'react-native';

import { AdminHomeScreen } from '../screens/Admin/AdminHomeScreen';
import { BrandFormScreen } from '../screens/Admin/BrandFormScreen';
import { BrandListScreen } from '../screens/Admin/BrandListScreen';
import { CategoryFormScreen } from '../screens/Admin/CategoryFormScreen';
import { CategoryListScreen } from '../screens/Admin/CategoryListScreen';
import { TagFormScreen } from '../screens/Admin/TagFormScreen';
import { TagListScreen } from '../screens/Admin/TagListScreen';

import { AddressFormScreen } from '../screens/Customers/AddressFormScreen';
import { AddressListScreen } from '../screens/Customers/AddressListScreen';
import { CustomerDetailScreen } from '../screens/Customers/CustomerDetailScreen';
import { CustomerFormScreen } from '../screens/Customers/CustomerFormScreen';
import { CustomerListScreen } from '../screens/Customers/CustomerListScreen';

import { ProductDetailScreen } from '../screens/Products/ProductDetailScreen';
import { ProductFormScreen } from '../screens/Products/ProductFormScreen';
import { ProductListScreen } from '../screens/Products/ProductListScreen';

import { CreateOrderScreen } from '../screens/Orders/CreateOrderScreen';
import { OrderDetailScreen } from '../screens/Orders/OrderDetailScreen';
import { OrderListScreen } from '../screens/Orders/OrderListScreen';

import type { AdminStackParamList, CustomersStackParamList, OrdersStackParamList, ProductsStackParamList, RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const AdminStack = createNativeStackNavigator<AdminStackParamList>();
const ProductsStack = createNativeStackNavigator<ProductsStackParamList>();
const CustomersStack = createNativeStackNavigator<CustomersStackParamList>();
const OrdersStack = createNativeStackNavigator<OrdersStackParamList>();

function AdminNavigator() {
  return (
    <AdminStack.Navigator>
      <AdminStack.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: 'Admin' }} />
      <AdminStack.Screen name="BrandList" component={BrandListScreen} options={{ title: 'Brands' }} />
      <AdminStack.Screen name="BrandForm" component={BrandFormScreen} options={({ route }) => ({ title: route.params?.id ? 'Edit Brand' : 'New Brand' })} />
      <AdminStack.Screen name="CategoryList" component={CategoryListScreen} options={{ title: 'Categories' }} />
      <AdminStack.Screen name="CategoryForm" component={CategoryFormScreen} options={({ route }) => ({ title: route.params?.id ? 'Edit Category' : 'New Category' })} />
      <AdminStack.Screen name="TagList" component={TagListScreen} options={{ title: 'Tags' }} />
      <AdminStack.Screen name="TagForm" component={TagFormScreen} options={({ route }) => ({ title: route.params?.id ? 'Edit Tag' : 'New Tag' })} />
    </AdminStack.Navigator>
  );
}

function ProductsNavigator() {
  return (
    <ProductsStack.Navigator>
      <ProductsStack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Products' }} />
      <ProductsStack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product Detail' }} />
      <ProductsStack.Screen name="ProductForm" component={ProductFormScreen} options={({ route }) => ({ title: route.params?.id ? 'Edit Product' : 'New Product' })} />
    </ProductsStack.Navigator>
  );
}

function CustomersNavigator() {
  return (
    <CustomersStack.Navigator>
      <CustomersStack.Screen name="CustomerList" component={CustomerListScreen} options={{ title: 'Customers' }} />
      <CustomersStack.Screen name="CustomerDetail" component={CustomerDetailScreen} options={{ title: 'Customer' }} />
      <CustomersStack.Screen name="CustomerForm" component={CustomerFormScreen} options={({ route }) => ({ title: route.params?.id ? 'Edit Customer' : 'New Customer' })} />
      <CustomersStack.Screen name="AddressList" component={AddressListScreen} options={{ title: 'Addresses' }} />
      <CustomersStack.Screen name="AddressForm" component={AddressFormScreen} options={({ route }) => ({ title: route.params?.id ? 'Edit Address' : 'New Address' })} />
    </CustomersStack.Navigator>
  );
}

function OrdersNavigator() {
  return (
    <OrdersStack.Navigator>
      <OrdersStack.Screen name="OrderList" component={OrderListScreen} options={{ title: 'Orders' }} />
      <OrdersStack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Order Detail' }} />
      <OrdersStack.Screen name="CreateOrder" component={CreateOrderScreen} options={{ title: 'New Order' }} />
    </OrdersStack.Navigator>
  );
}

const TAB_ICONS: Record<keyof RootTabParamList, string> = {
  Products: '🧴',
  Orders: '📦',
  Customers: '👤',
  Admin: '⚙️',
};

export function RootNavigator() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: () => <Text style={{ fontSize: 20 }}>{TAB_ICONS[route.name]}</Text>,
    })}>
      <Tab.Screen name="Products" component={ProductsNavigator} />
      <Tab.Screen name="Orders" component={OrdersNavigator} />
      <Tab.Screen name="Customers" component={CustomersNavigator} />
      <Tab.Screen name="Admin" component={AdminNavigator} />
    </Tab.Navigator>
  );
}
