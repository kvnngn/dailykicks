export default {
  AUTH: {
    LOGIN: 'LOGIN',
    LOGIN_WITH_TOKEN: 'LOGIN_WITH_TOKEN',
    REGISTER: 'AUTH_REGISTER',
    RESET_PASSWORD: 'RESET_PASSWORD',
    UPDATE_PASSWORD: 'UPDATE_PASSWORD',
    RESEND_VERIFICATION: 'RESEND_VERIFICATION'
  },
  CURRENT: {
    USERS: 'CURRENT_USER'
  },
  MANAGEMENT: {
    WAREHOUSE: {
      ADD: 'ADD_WAREHOUSE',
      GET: 'GET_WAREHOUSES',
      DELETE: 'DELETE_WAREHOUSES'
    },
    PRODUCT: {
      ADD: 'ADD_PRODUCT',
      GET: 'GET_PRODUCTS',
      GET_BRANDS: 'GET_BRANDS',
      GET_BRANDMODELS: 'GET_BRANDMODELS',
      DELETE: 'DELETE_PRODUCTS'
    }
  }
} as const;
