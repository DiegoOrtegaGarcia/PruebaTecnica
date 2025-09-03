import { describe, it, expect } from 'vitest'
import { validateStringField, validateAge, validateEmail } from '../../src/helpers/formValidations'

describe('formValidations', () => {
  describe('validateStringField', () => {
    it('should return true for valid string', () => {
      expect(validateStringField('John')).toBe(true)
    })

    it('should return error for empty string', () => {
      expect(validateStringField('')).toBe('El nombre es obligatorio')
    })

    it('should return error for string exceeding 255 characters', () => {
      const longString = 'a'.repeat(256)
      expect(validateStringField(longString)).toBe('El nombre no puede exceder 255 caracteres')
    })
  })

  describe('validateAge', () => {
    it('should return true for valid age', () => {
      expect(validateAge('25')).toBe(true)
    })

    it('should return error for empty age', () => {
      expect(validateAge('')).toBe('La edad es obligatoria')
    })

    it('should return error for age > 120', () => {
      expect(validateAge('121')).toBe('La edad no valida')
    })

    it('should return error for negative age', () => {
      expect(validateAge('-1')).toBe('La edad no valida')
    })

    it('should return error for non-integer age', () => {
      expect(validateAge('25.5')).toBe('La edad debe ser un número entero')
    })
  })

  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true)
    })

    it('should return error for empty email', () => {
      expect(validateEmail('')).toBe('El correo electrónico es obligatorio')
    })

    it('should return error for invalid email', () => {
      expect(validateEmail('invalid-email')).toBe('Debe ser un correo electrónico válido')
      expect(validateEmail('test@')).toBe('Debe ser un correo electrónico válido')
      expect(validateEmail('@example.com')).toBe('Debe ser un correo electrónico válido')
    })
  })
})