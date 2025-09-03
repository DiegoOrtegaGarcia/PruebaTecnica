import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useFormCoponent } from '../../src/hooks/useFormComponent'

// Mock todas las dependencias pesadas
vi.mock('@/axios/axiosToken', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn()
  }
}))

vi.mock('vee-validate', () => ({
  useField: () => ({
    value: { value: '' },
    errorMessage: { value: '' }
  })
}))

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    onMounted: vi.fn()
  }
})

describe('useFormComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns expected properties', () => {
    const form = useFormCoponent()
    
    // Verificar que devuelve un objeto con las propiedades esperadas
    expect(form).toBeDefined()
    expect(typeof form).toBe('object')
    expect(form).toHaveProperty('formData')
    expect(form).toHaveProperty('loading')
    expect(form).toHaveProperty('submitForm')
    expect(form).toHaveProperty('getSexLabel')
    expect(form).toHaveProperty('getSexColor')
  })

  it('getSexLabel returns correct labels', () => {
    const form = useFormCoponent()
    
    // Probamos la función getSexLabel directamente
    expect(form.getSexLabel('male')).toBe('Masculino')
    expect(form.getSexLabel('female')).toBe('Femenino')
    expect(form.getSexLabel('other')).toBe('Otro')
  })

  it('getSexColor returns correct colors', () => {
    const form = useFormCoponent()
    
    // Probamos la función getSexColor directamente
    expect(form.getSexColor('male')).toBe('blue')
    expect(form.getSexColor('female')).toBe('pink')
    expect(form.getSexColor('other')).toBe('green')
  })
})