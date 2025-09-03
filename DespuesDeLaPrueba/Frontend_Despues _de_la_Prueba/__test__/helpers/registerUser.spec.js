import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRegisterForm } from '@/hooks/Pages/useRegisterForm'

// Mock de las dependencias
vi.mock('@/helpers/Api/registerUser', () => ({
  registerUser: vi.fn()
}))

vi.mock('vee-validate', () => ({
  useField: () => ({
    value: { value: '' },
    errorMessage: { value: '' }
  }),
  useForm: () => ({
    handleSubmit: (fn) => fn
  })
}))

describe('useRegisterForm', () => {
  beforeEach(() => {
    // Crear una nueva instancia de Pinia y establecerla como activa
    setActivePinia(createPinia())
  })

  it('initializes form fields', () => {
    const alertMessage = vi.fn()
    const finishMessage = vi.fn()
    
    const { name, email, password, isLoading, submit } = useRegisterForm(alertMessage, finishMessage)

    expect(name).toBeDefined()
    expect(email).toBeDefined()
    expect(password).toBeDefined()
    expect(isLoading.value).toBe(false)
    expect(typeof submit).toBe('function')
  })
})