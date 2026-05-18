import apiClient from './client';

// All store endpoints go through the shared apiClient — that's what carries the
// auth bearer + 401-refresh interceptor and reads VITE_API_URL as the baseURL.
const unwrap = (p) => p.then((r) => r.data);

export const getProductDetail = (productId) =>
  unwrap(apiClient.get(`/store/products/${productId}/`));

export const getProductVendors = (productId) =>
  unwrap(apiClient.get(`/store/products/${productId}/vendors/`));

export const placeOrder = (payload) =>
  unwrap(apiClient.post('/store/orders/', payload));

export const getOrderDetail = (orderId) =>
  unwrap(apiClient.get(`/store/orders/${orderId}/`));

export const storeApi = {
  getProductDetail,
  getProductVendors,
  placeOrder,
  getOrderDetail,
};

export default storeApi;
