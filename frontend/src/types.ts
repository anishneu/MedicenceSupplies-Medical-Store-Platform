export type Role = 'ADMIN' | 'CUSTOMER' | 'SUPPLIER'

export interface AuthUser {
  token: string
  userId: number
  username: string
  role: Role
}

export interface Medication {
  id: number
  name: string
  category: string
  price: number
  stock: number
  description?: string | null
  imageUrl?: string | null
  featured?: boolean
  timesOrdered?: number
}

export interface CartItem {
  medication: Medication
  quantity: number
}

export interface OrderItem {
  medicationId: number
  medicationName: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: number
  userId: number
  username: string
  orderDate: string
  status: 'PENDING' | 'PROCESSED' | 'CANCELLED'
  items: OrderItem[]
  total: number
}

export interface StockRequest {
  id: number
  medicationId: number
  medicationName: string
  requestedQuantity: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  requestedBy: string
  createdAt: string
}

export interface UserProfile {
  id: number
  username: string
  role: Role
  email?: string | null
  fullName?: string | null
  phone?: string | null
  address?: string | null
  notifyOrders: boolean
  notifyStock: boolean
}

export interface SupportTicket {
  id: number
  subject: string
  message: string
  category: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'
  username: string
  createdAt: string
}

export interface DashboardStats {
  medicationCount: number
  lowStockCount: number
  pendingOrderCount: number
  pendingStockRequestCount: number
  openTicketCount: number
}

export const PLACEHOLDER_IMAGE = '/products/placeholder.svg'
