import type { FormField } from "@/types"

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[0-9-+\s()]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
  }
  return phone
}

export function validateForm(data: Record<string, string>, fields: FormField[]): Record<string, string> {
  const errors: Record<string, string> = {}

  fields.forEach((field) => {
    const value = data[field.name] || ""

    if (field.required && !validateRequired(value)) {
      errors[field.name] = `${field.label}은(는) 필수 입력 항목입니다.`
      return
    }

    if (value && field.type === "email" && !validateEmail(value)) {
      errors[field.name] = "올바른 이메일 형식이 아닙니다."
    }

    if (value && field.type === "tel" && !validatePhone(value)) {
      errors[field.name] = "올바른 전화번호 형식이 아닙니다."
    }
  })

  return errors
}

export function hasFormErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length > 0
}
