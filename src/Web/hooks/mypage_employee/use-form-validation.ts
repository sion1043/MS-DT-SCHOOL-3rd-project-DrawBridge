"use client"

import { useState, useCallback } from "react"
import { validateForm, hasFormErrors } from "@/lib/mypage_employee/form-utils"
import type { FormField } from "@/types/mypage_employee"

export function useFormValidation(fields: FormField[]) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = useCallback(
    (name: string, value: string) => {
      const field = fields.find((f) => f.name === name)
      if (!field) return ""

      const fieldErrors = validateForm({ [name]: value }, [field])
      return fieldErrors[name] || ""
    },
    [fields],
  )

  const validateAllFields = useCallback(
    (data: Record<string, string>) => {
      const newErrors = validateForm(data, fields)
      setErrors(newErrors)
      return !hasFormErrors(newErrors)
    },
    [fields],
  )

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }))
  }, [])

  const clearFieldError = useCallback((name: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }, [])

  const clearAllErrors = useCallback(() => {
    setErrors({})
  }, [])

  const touchField = useCallback((name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
  }, [])

  const touchAllFields = useCallback(() => {
    const allTouched = fields.reduce(
      (acc, field) => {
        acc[field.name] = true
        return acc
      },
      {} as Record<string, boolean>,
    )
    setTouched(allTouched)
  }, [fields])

  const resetForm = useCallback(() => {
    setErrors({})
    setTouched({})
  }, [])

  const isFieldTouched = useCallback(
    (name: string) => {
      return touched[name] || false
    },
    [touched],
  )

  const getFieldError = useCallback(
    (name: string) => {
      return errors[name] || ""
    },
    [errors],
  )

  const hasAnyErrors = hasFormErrors(errors)

  return {
    errors,
    touched,
    validateField,
    validateAllFields,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    touchField,
    touchAllFields,
    resetForm,
    isFieldTouched,
    getFieldError,
    hasAnyErrors,
  }
}
