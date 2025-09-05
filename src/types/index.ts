// Core entity types from Prisma
export type {
  Tenant,
  Restaurant,
  User,
  UserRole,
  Menu,
  Category,
  Item,
  Variation,
  Modifier,
  ModifierType,
  Ingredient,
  Recipe,
  RecipeIngredient,
  Area,
  Table,
  TableStatus,
  Order,
  OrderStatus,
  OrderType,
  PaymentStatus,
  OrderItem,
  OrderItemStatus,
  OrderItemModifier,
  OrderEvent,
  EventType,
  Payment,
  PaymentMethod,
  Station,
  StationType,
  Printer,
  PrinterType,
} from '@prisma/client'

// Extended types for application use
export interface TenantWithTheme extends Tenant {
  theme: {
    logo?: string
    primaryColor: string
    secondaryColor: string
    fontFamily: string
  }
}

export interface MenuWithItems extends Menu {
  categories: CategoryWithItems[]
}

export interface CategoryWithItems extends Category {
  items: ItemWithDetails[]
}

export interface ItemWithDetails extends Item {
  variations: Variation[]
  modifiers: Modifier[]
  recipes: Recipe[]
}

export interface OrderWithDetails extends Order {
  items: OrderItemWithDetails[]
  events: OrderEvent[]
  payments: Payment[]
  table?: Table
  restaurant: Restaurant
}

export interface OrderItemWithDetails extends OrderItem {
  item: Item
  variation?: Variation
  modifiers: (OrderItemModifier & {
    modifier: Modifier
  })[]
}

export interface CartItem {
  id: string
  itemId: string
  item: ItemWithDetails
  variationId?: string
  variation?: Variation
  quantity: number
  modifiers: Array<{
    modifierId: string
    modifier: Modifier
    quantity: number
  }>
  unitPrice: number
  totalPrice: number
  notes?: string
}

export interface CartState {
  items: CartItem[]
  subtotal: number
  taxAmount: number
  total: number
  tableId?: string
  restaurantId?: string
  notes?: string
}

export interface KitchenOrder {
  id: string
  orderNumber: string
  tableNumber?: string
  items: KitchenOrderItem[]
  status: OrderStatus
  createdAt: Date
  estimatedTime?: number
  sla: {
    elapsed: number
    status: 'green' | 'yellow' | 'red'
    remainingTime?: number
  }
}

export interface KitchenOrderItem {
  id: string
  itemName: string
  quantity: number
  variations?: string[]
  modifiers?: string[]
  notes?: string
  status: OrderItemStatus
}

// API response types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}

// WebSocket message types
export interface WebSocketMessage {
  type: 'ORDER_UPDATE' | 'KITCHEN_UPDATE' | 'PAYMENT_UPDATE' | 'CONNECTION' | 'ERROR'
  payload: any
  timestamp: string
  restaurantId?: string
  tenantId?: string
}

// Theme and branding types
export interface RestaurantTheme {
  logo?: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  borderRadius: string
  customCSS?: string
}

// Payment types
export interface PaymentIntent {
  orderId: string
  amount: number
  method: PaymentMethod
  metadata?: Record<string, any>
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  status: PaymentStatus
  error?: string
  redirectUrl?: string
}

// Printer types
export interface PrintJob {
  printerId: string
  template: string
  data: Record<string, any>
  priority: 'low' | 'normal' | 'high'
}

// Analytics types
export interface RestaurantAnalytics {
  period: {
    from: Date
    to: Date
  }
  orders: {
    total: number
    completed: number
    canceled: number
    averageValue: number
  }
  revenue: {
    total: number
    byDay: Array<{ date: string; amount: number }>
    byCategory: Array<{ category: string; amount: number }>
  }
  items: {
    mostPopular: Array<{ item: string; quantity: number }>
    leastPopular: Array<{ item: string; quantity: number }>
  }
  performance: {
    averageOrderTime: number
    slaCompliance: number
  }
}

// Form types
export interface CreateOrderInput {
  restaurantId: string
  tableId?: string
  items: Array<{
    itemId: string
    variationId?: string
    quantity: number
    modifiers?: Array<{
      modifierId: string
      quantity: number
    }>
    notes?: string
  }>
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  notes?: string
  paymentMethod?: PaymentMethod
}

export interface UpdateOrderStatusInput {
  orderId: string
  status: OrderStatus
  notes?: string
}

// Error types
export class AppError extends Error {
  code: string
  statusCode: number
  details?: any

  constructor(message: string, code: string, statusCode: number = 500, details?: any) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.name = 'AppError'
  }
}

// Validation types
export interface ValidationError {
  field: string
  message: string
  code: string
}