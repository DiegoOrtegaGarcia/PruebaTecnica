export function validateStringField (value: string) {
  if (!value) {
    return 'El nombre es obligatorio'
  }
  if (value.length > 255) {
    return 'El nombre no puede exceder 255 caracteres'
  }
  return true
}

export function validateAge (value: string) {
  if (!value) {
    return 'La edad es obligatoria'
  }
  const age = Number(value)
  if (age > 120 || age < 0) {
    return 'La edad no valida'
  }
  if (!Number.isInteger(age)) {
    return 'La edad debe ser un número entero'
  }
  return true
}

export function validateEmail (value: string) {
  if (!value) {
    return 'El correo electrónico es obligatorio'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return 'Debe ser un correo electrónico válido'
  }
  return true
}
