import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import MainLayout from './pages/MainLayout';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import FilterProducts from './pages/FilterProducts';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';

import CustomerLayout from './customer/CustomerLayout';
import CustomerDashboard from './customer/CustomerDashboard';
import Address from './customer/Address';
import AddAddress from './customer/AddAddress';
import EditAddress from './customer/EditAddress';
import Orders from './customer/Orders';
import AccountSecurity from './customer/AccountSecurity';
import Wishlist from './customer/Wishlist';

import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import AdminRegister from './admin/AdminRegister';
import AdminDashboard from './admin/AdminDashboard';
import ManageUsers from './admin/ManageUsers';
import ViewProducts from './admin/ViewProducts';
import AddProduct from './admin/AddProduct';
import EditProduct from './admin/EditProduct';
import ManageOrders from './admin/ManageOrders';


function App() {
  return (
    <Routes>
      {/* Public & Customer Pages with Header/Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/customer-register" element={<CustomerRegister />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/:gender/:category" element={<FilterProducts />} />
        <Route path="/:gender" element={<FilterProducts />} />
        <Route path="/category/:category" element={<FilterProducts />} />
        <Route path="/brand/:brand" element={<FilterProducts />} />
        <Route path="/shop" element={<FilterProducts />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/payment" element={<Payment />} />

        <Route element={<CustomerLayout />}>
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/address" element={<Address />} />
          <Route path="/customer/address/add" element={<AddAddress />} />
          <Route path="/customer/address/edit" element={<EditAddress />} />
          <Route path="/customer/orders" element={<Orders />} />
          <Route path="/customer/security" element={<AccountSecurity />} />
          <Route path="/customer/wishlist" element={<Wishlist />} />
        </Route>
      </Route>

      {/* Admin Pages without Header/Footer */}
      <Route element={<AdminLayout />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/products" element={<ViewProducts />} />
        <Route path="/admin/product/add" element={<AddProduct />} />
        <Route path="/admin/product/edit/:id" element={<EditProduct />} />
        <Route path="/admin/orders" element={<ManageOrders />} />
      </Route>

      {/* Admin Auth Pages (standalone) */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-register" element={<AdminRegister />} />

      {/* 404 fallback */}
      <Route path="*" element={<h2 style={{ padding: '2rem' }}>404 - Page Not Found</h2>} />
    </Routes>
  );
}

export default App;
