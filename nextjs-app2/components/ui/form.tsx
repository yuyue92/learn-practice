'use client'

import { useState, FormEvent } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select'
  required?: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
  value?: any
  onChange?: (value: any) => void
  error?: string
  className?: string
}

export function FormField({
  label,
  name,
  type = 'text',
  required = false,
  options = [],
  placeholder,
  value,
  onChange,
  error,
  className
}: FormFieldProps) {
  const handleChange = (e: any) => {
    const newValue = type === 'number' ? Number(e.target.value) : e.target.value
    onChange?.(newValue)
  }

  const renderInput = () => {
    const baseClasses = cn(
      "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      error ? "border-red-500" : "border-gray-300",
      className
    )

    switch (type) {
      case 'textarea':
        return (
          <textarea
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            required={required}
            className={cn(baseClasses, "min-h-[100px] resize-vertical")}
          />
        )
      case 'select':
        return (
          <select
            name={name}
            value={value}
            onChange={handleChange}
            required={required}
            className={baseClasses}
          >
            <option value="">请选择...</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      default:
        return (
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            required={required}
            className={baseClasses}
          />
        )
    }
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

interface FormProps {
  children: React.ReactNode
  onSubmit: (data: any) => void | Promise<void>
  className?: string
  submitText?: string
  loading?: boolean
}

export function Form({ children, onSubmit, className, submitText = '提交', loading = false }: FormProps) {
  const [formData, setFormData] = useState<any>({})
  const [errors, setErrors] = useState<any>({})

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit(formData)
    } catch (error: any) {
      setErrors(error.fields || {})
    }
  }

  const updateField = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: null }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-4">
        {children}
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={loading}>
          {loading ? '提交中...' : submitText}
        </Button>
      </div>
    </form>
  )
}