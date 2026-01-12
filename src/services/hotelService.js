import { request } from './api';

export const fetchRooms = () => request('/rooms');
export const createRoom = (payload) =>
  request('/rooms', { method: 'POST', body: JSON.stringify(payload) });
export const updateRoom = (id, payload) =>
  request(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteRoom = (id) => request(`/rooms/${id}`, { method: 'DELETE' });

export const fetchEmployees = () => request('/employees');
export const createEmployee = (payload) =>
  request('/employees', { method: 'POST', body: JSON.stringify(payload) });
export const updateEmployee = (id, payload) =>
  request(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteEmployee = (id) => request(`/employees/${id}`, { method: 'DELETE' });

export const fetchServices = () => request('/services');
export const createService = (payload) =>
  request('/services', { method: 'POST', body: JSON.stringify(payload) });
export const updateService = (id, payload) =>
  request(`/services/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteService = (id) => request(`/services/${id}`, { method: 'DELETE' });

export const fetchReservations = () => request('/reservations');
export const createReservation = (payload) =>
  request('/reservations', { method: 'POST', body: JSON.stringify(payload) });
export const confirmReservation = (id) =>
  request(`/reservations/${id}/confirm`, { method: 'POST' });
export const cancelReservation = (id) =>
  request(`/reservations/${id}/cancel`, { method: 'POST' });

export const fetchInvoiceByReservation = (reservationId) =>
  request(`/invoices/${reservationId}`);
export const generateInvoice = (payload) =>
  request('/invoices/generate', { method: 'POST', body: JSON.stringify(payload) });

export const fetchStats = () => request('/stats');
