import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit", 
    year: "numeric",
  }).format(dateObj)
}

export function formatTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj)
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj)
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
  return `${timestamp}${random}`
}

export function calculateOrderTotal(
  items: Array<{
    unitPrice: number
    quantity: number
    modifiers?: Array<{ unitPrice: number; quantity: number }>
  }>
): { subtotal: number; taxAmount: number; total: number } {
  const subtotal = items.reduce((acc, item) => {
    const itemTotal = item.unitPrice * item.quantity
    const modifiersTotal = (item.modifiers || []).reduce(
      (modAcc, mod) => modAcc + mod.unitPrice * mod.quantity,
      0
    )
    return acc + itemTotal + modifiersTotal
  }, 0)

  const taxRate = 0.0 // No tax for restaurants in most cases in Brazil
  const taxAmount = subtotal * taxRate
  const total = subtotal + taxAmount

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}

export function calculateSLA(createdAt: Date): {
  elapsed: number
  status: "green" | "yellow" | "red"
  remainingTime?: number
} {
  const now = new Date()
  const elapsed = Math.floor((now.getTime() - createdAt.getTime()) / 1000 / 60) // minutes

  let status: "green" | "yellow" | "red" = "green"
  let remainingTime: number | undefined

  if (elapsed < 8) {
    status = "green"
    remainingTime = 8 - elapsed
  } else if (elapsed < 15) {
    status = "yellow"
    remainingTime = 15 - elapsed
  } else {
    status = "red"
  }

  return { elapsed, status, remainingTime }
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function throttle<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = new Date().getTime()
    if (now - lastCall < delay) return
    lastCall = now
    func(...args)
  }
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

export function generateQRToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + "..."
}

export function parseJSONSafe<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return defaultValue
  }
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function isValidURL(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}