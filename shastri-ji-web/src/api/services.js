import apiClient from './client';

const unwrap = (p) => p.then((r) => r.data);

export const authApi = {
  sendOtp: (phone_number) =>
    unwrap(apiClient.post('/auth/send_otp/', { phone_number })),
  verifyOtp: (phone_number, otp) =>
    unwrap(apiClient.post('/auth/verify_otp/', { phone_number, otp })),
  shortRegister: (phone_number, name, role) =>
    unwrap(apiClient.post('/auth/short_register/', { phone_number, name, role })),
  refreshToken: (refresh) =>
    unwrap(apiClient.post('/auth/token/refresh/', { refresh })),
  getProfile: () => unwrap(apiClient.get('/auth/profile/')),
  updateProfile: (data) => unwrap(apiClient.patch('/auth/profile/', data)),
  updateLocation: (lat, lng) =>
    unwrap(apiClient.post('/auth/update-location/', { lat, lng })),
  getRegistrationOptions: () =>
    unwrap(apiClient.get('/auth/registration_options/')),
  detailedRegisterUser: (data) =>
    unwrap(apiClient.post('/auth/detailed_register/user/', data)),
  detailedRegisterPriestStep1: (data) =>
    unwrap(apiClient.post('/auth/detailed_register/priest/step1/', data)),
  detailedRegisterPriestStep2: (data) =>
    unwrap(
      apiClient.post('/auth/detailed_register/priest/step2/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ),
  skipDetailedRegister: () =>
    unwrap(apiClient.post('/auth/detailed_register/skip/')),
};

export const ritualsApi = {
  list: (params) => unwrap(apiClient.get('/rituals/', { params })),
  featured: () => unwrap(apiClient.get('/rituals/featured/')),
  detail: (id) => unwrap(apiClient.get(`/rituals/${id}/`)),
  categories: () => unwrap(apiClient.get('/rituals/categories/')),
  ritualVariants: (ritualId) =>
    unwrap(apiClient.get(`/rituals/${ritualId}/variants/`)),
  ritualPriests: (ritualId) =>
    unwrap(apiClient.get(`/rituals/${ritualId}/priests/`)),
  traditions: () => unwrap(apiClient.get('/rituals/traditions/')),
  variants: (params) =>
    unwrap(apiClient.get('/rituals/variants/', { params })),
  variantDetail: (id) => unwrap(apiClient.get(`/rituals/variants/${id}/`)),
};

export const priestsApi = {
  search: (body) => unwrap(apiClient.post('/priests/', body)),
  featured: () => unwrap(apiClient.get('/priests/featured/')),
  detail: (id) => unwrap(apiClient.get(`/priests/${id}/`)),
  rituals: (id) => unwrap(apiClient.get(`/priests/${id}/rituals/`)),
  variants: (id) => unwrap(apiClient.get(`/priests/${id}/variants/`)),
  availability: (id, date) =>
    unwrap(apiClient.get(`/priests/${id}/availability/`, { params: { date } })),
  recommendations: () => unwrap(apiClient.get('/priests/recommendations/')),
  filters: () => unwrap(apiClient.get('/priests/filters/')),
};

export const bookingsApi = {
  create: (data) => unwrap(apiClient.post('/bookings/', data)),
  list: () => unwrap(apiClient.get('/bookings/')),
  detail: (id) => unwrap(apiClient.get(`/bookings/${id}/`)),
  respond: (id, response, message) =>
    unwrap(apiClient.post(`/bookings/${id}/respond/`, { response, message })),
  complete: (id) => unwrap(apiClient.post(`/bookings/${id}/complete/`)),
};

export const priestBookingsApi = {
  list: () => unwrap(apiClient.get('/priest/bookings/')),
  detail: (id) => unwrap(apiClient.get(`/priest/bookings/${id}/`)),
  action: (id, action, proposed_date, proposed_time, message) =>
    unwrap(
      apiClient.post(`/priest/bookings/${id}/action/`, {
        action,
        proposed_date,
        proposed_time,
        message,
      })
    ),
};

export const calendarApi = {
  panchang: (date) => unwrap(apiClient.get('/calendar/', { params: { date } })),
};

export const notificationsApi = {
  list: (unreadOnly) =>
    unwrap(
      apiClient.get('/notifications/', {
        params: unreadOnly ? { unread_only: true } : {},
      })
    ),
  unreadCount: () => unwrap(apiClient.get('/notifications/unread-count/')),
  markRead: (id) => unwrap(apiClient.post(`/notifications/${id}/read/`)),
  markAllRead: () => unwrap(apiClient.post('/notifications/mark-all-read/')),
};

export const bannersApi = {
  list: () => unwrap(apiClient.get('/banners/')),
};

export const priestDashboardApi = {
  stats: () => unwrap(apiClient.get('/priest/dashboard/stats/')),
  getProfile: () => unwrap(apiClient.get('/priest/dashboard/profile/')),
  updateProfile: (data) =>
    unwrap(apiClient.patch('/priest/dashboard/profile/', data)),
  rituals: () => unwrap(apiClient.get('/priest/dashboard/rituals/')),
  addRitual: (data) =>
    unwrap(apiClient.post('/priest/dashboard/rituals/', data)),
  removeRitual: (id) =>
    unwrap(apiClient.delete(`/priest/dashboard/rituals/${id}/`)),
};

export const adminApi = {
  stats: () => unwrap(apiClient.get('/admin/stats/')),
  priests: (params) => unwrap(apiClient.get('/admin/priests/', { params })),
  priestDetail: (id) => unwrap(apiClient.get(`/admin/priests/${id}/`)),
  priestAction: (id, action) =>
    unwrap(apiClient.post(`/admin/priests/${id}/action/`, { action })),
  users: (params) => unwrap(apiClient.get('/admin/users/', { params })),
  userDetail: (id) => unwrap(apiClient.get(`/admin/users/${id}/`)),
  userAction: (id, action) =>
    unwrap(apiClient.post(`/admin/users/${id}/action/`, { action })),
  rituals: () => unwrap(apiClient.get('/admin/rituals/')),
  createRitual: (data) => unwrap(apiClient.post('/admin/rituals/', data)),
  updateRitual: (id, data) =>
    unwrap(apiClient.patch(`/admin/rituals/${id}/`, data)),
  deleteRitual: (id) => unwrap(apiClient.delete(`/admin/rituals/${id}/`)),
  ritualAction: (id, action) =>
    unwrap(apiClient.post(`/admin/rituals/${id}/action/`, { action })),
  categories: () => unwrap(apiClient.get('/admin/categories/')),
  createCategory: (data) => unwrap(apiClient.post('/admin/categories/', data)),
  updateCategory: (id, data) =>
    unwrap(apiClient.patch(`/admin/categories/${id}/`, data)),
  banners: () => unwrap(apiClient.get('/admin/banners/')),
  createBanner: (data) => unwrap(apiClient.post('/admin/banners/', data)),
  updateBanner: (id, data) =>
    unwrap(apiClient.patch(`/admin/banners/${id}/`, data)),
  deleteBanner: (id) => unwrap(apiClient.delete(`/admin/banners/${id}/`)),
  generateBanner: (ritualId) =>
    unwrap(apiClient.post('/admin/banners/generate/', { ritual_id: ritualId })),
  broadcast: (data) => unwrap(apiClient.post('/admin/broadcast/', data)),
};
