import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRegisterForm } from '@/modules/register/hooks/useRegisterForm'

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
    handleSubmit: (fn: any) => fn
  })
}))

// Mock de Vue
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    ref: vi.fn((initialValue) => ({ value: initialValue })),
  }
})

describe('useRegisterForm', () => {
  beforeEach(() => {
    // Configurar Pinia
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
