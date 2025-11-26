// src/services/apiUrls.js

export const BASE_URL = "https://trenzo-backend.onrender.com";

const API_URLS = {
  AUTH: {
    LOGIN: `${BASE_URL}/api/auth/login`,
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGOUT: `${BASE_URL}/api/auth/logout`,
  },
  COMMON: {
    GET_FEATURED_IMAGE: `${BASE_URL}/api/common/feature/get`,
    ADD_FEATURED_IMAGE: `${BASE_URL}/api/common/feature/add`,
    CHECK_AUTH: `${BASE_URL}/api/auth/check-auth`,
    UPLOAD_IMAGE: `${BASE_URL}/api/admin/products/upload-image`,
  },
  SHOP: {
    //ADDRESS
    ADD_ADDRESS: `${BASE_URL}/api/shop/address/add`,
    EDIT_ADDRESS: (userId, addressId) =>
      `${BASE_URL}/api/shop/address/update/${userId}/${addressId}`,
    DELETE_ADDRESS: (userId, addressId) =>
      `${BASE_URL}/api/shop/address/delete/${userId}/${addressId}`,
    FETCH_ALL_ADDRESSES: (userId) =>
      `${BASE_URL}/api/shop/address/get/${userId}`,

    // Cart APIs
    ADD_CART: `${BASE_URL}/api/shop/cart/add`,
    UPDATE_CART: `${BASE_URL}/api/shop/cart/update-cart`,
    DELETE_CART: (userId, productId) =>
      `${BASE_URL}/api/shop/cart/${userId}/${productId}`,
    FETCH_CART: (userId) => `${BASE_URL}/api/shop/cart/get/${userId}`,

    // Order APIs
    CREATE_ORDER: `${BASE_URL}/api/shop/order/create`,
    CAPTURE_PAYMENT: `${BASE_URL}/api/shop/order/capture`,
    GET_ORDERS_BY_USER: (userId) => `${BASE_URL}/api/shop/order/list/${userId}`,
    GET_ORDER_DETAILS: (orderId) =>
      `${BASE_URL}/api/shop/order/details/${orderId}`,

    // Products
    GET_ALL_PRODUCTS: `${BASE_URL}/api/shop/products/get`,
    GET_PRODUCT_DETAILS: (id) => `${BASE_URL}/api/shop/products/get/${id}`,

    // Reviews
    ADD_REVIEW: `${BASE_URL}/api/shop/review/add`,
    GET_REVIEWS: (productId) => `${BASE_URL}/api/shop/review/${productId}`,

    // Search
    SEARCH_PRODUCTS: (keyword) => `${BASE_URL}/api/shop/search/${keyword}`,
  },
  ADMIN: {
    // Admin orders
    GET_ALL_ORDERS: `${BASE_URL}/api/admin/orders/get`,
    GET_ORDER_DETAILS: (orderId) =>
      `${BASE_URL}/api/admin/orders/details/${orderId}`,
    UPDATE_ORDER_STATUS: (orderId) =>
      `${BASE_URL}/api/admin/orders/update/${orderId}`,

    // Admin products
    ADD_PRODUCT: `${BASE_URL}/api/admin/products/add`,
    FETCH_PRODUCTS: `${BASE_URL}/api/admin/products/get`,
    EDIT_PRODUCT: (id) => `${BASE_URL}/api/admin/products/edit/${id}`,
    DELETE_PRODUCT: (id) => `${BASE_URL}/api/admin/products/delete/${id}`,
  },
};

export default API_URLS;
