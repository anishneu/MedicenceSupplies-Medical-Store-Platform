import api from './client'
import type {
  AuthUser,
  DashboardStats,
  Medication,
  Order,
  Role,
  StockRequest,
  SupportTicket,
  UserProfile,
} from '../types'

export async function login(username: string, password: string): Promise<AuthUser> {
  const { data } = await api.post('/api/auth/login', { username, password })
  return data
}

export async function register(payload: {
  username: string
  password: string
  role: Role
  supplierName?: string
  contactInfo?: string
}): Promise<AuthUser> {
  const { data } = await api.post('/api/auth/register', payload)
  return data
}

export async function fetchMedications(): Promise<Medication[]> {
  const { data } = await api.get('/api/medications')
  return data
}

export async function fetchMedication(id: number): Promise<Medication> {
  const { data } = await api.get(`/api/medications/${id}`)
  return data
}

export async function createMedication(
  payload: Omit<Medication, 'id' | 'timesOrdered'> & { featured?: boolean },
): Promise<Medication> {
  const { data } = await api.post('/api/medications', payload)
  return data
}

export async function updateMedication(
  id: number,
  payload: Omit<Medication, 'id' | 'timesOrdered'> & { featured?: boolean },
): Promise<Medication> {
  const { data } = await api.put(`/api/medications/${id}`, payload)
  return data
}

export async function deleteMedication(id: number): Promise<void> {
  await api.delete(`/api/medications/${id}`)
}

export async function fetchLowStock(threshold = 20): Promise<Medication[]> {
  const { data } = await api.get('/api/medications/low-stock', { params: { threshold } })
  return data
}

export async function placeOrder(items: { medicationId: number; quantity: number }[]): Promise<Order> {
  const { data } = await api.post('/api/orders', { items })
  return data
}

export async function fetchMyOrders(): Promise<Order[]> {
  const { data } = await api.get('/api/orders/mine')
  return data
}

export async function fetchAllOrders(): Promise<Order[]> {
  const { data } = await api.get('/api/orders')
  return data
}

export async function processOrder(id: number): Promise<Order> {
  const { data } = await api.post(`/api/orders/${id}/process`)
  return data
}

export async function createStockRequest(medicationId: number, requestedQuantity: number): Promise<StockRequest> {
  const { data } = await api.post('/api/admin/stock-requests', { medicationId, requestedQuantity })
  return data
}

export async function fetchAdminStockRequests(): Promise<StockRequest[]> {
  const { data } = await api.get('/api/admin/stock-requests')
  return data
}

export async function fetchPendingStockRequests(): Promise<StockRequest[]> {
  const { data } = await api.get('/api/supplier/stock-requests')
  return data
}

export async function approveStockRequest(id: number): Promise<StockRequest> {
  const { data } = await api.post(`/api/supplier/stock-requests/${id}/approve`)
  return data
}

export async function rejectStockRequest(id: number): Promise<StockRequest> {
  const { data } = await api.post(`/api/supplier/stock-requests/${id}/reject`)
  return data
}

export async function updateStock(medicationId: number, stock: number): Promise<Medication> {
  const { data } = await api.post('/api/supplier/stock', { medicationId, stock })
  return data
}

export async function fetchProfile(): Promise<UserProfile> {
  const { data } = await api.get('/api/account/profile')
  return data
}

export async function updateProfile(payload: Partial<UserProfile>): Promise<UserProfile> {
  const { data } = await api.put('/api/account/profile', payload)
  return data
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await api.put('/api/account/password', { currentPassword, newPassword })
}

export async function createSupportTicket(payload: {
  subject: string
  message: string
  category: string
}): Promise<SupportTicket> {
  const { data } = await api.post('/api/support/tickets', payload)
  return data
}

export async function fetchMyTickets(): Promise<SupportTicket[]> {
  const { data } = await api.get('/api/support/tickets/mine')
  return data
}

export async function fetchAllTickets(): Promise<SupportTicket[]> {
  const { data } = await api.get('/api/support/tickets')
  return data
}

export async function updateTicketStatus(
  id: number,
  status: SupportTicket['status'],
): Promise<SupportTicket> {
  const { data } = await api.put(`/api/support/tickets/${id}/status`, { status })
  return data
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get('/api/dashboard/stats')
  return data
}
