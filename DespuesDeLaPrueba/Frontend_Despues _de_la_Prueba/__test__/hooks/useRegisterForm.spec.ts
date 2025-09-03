import { describe, it, expect, vi } from 'vitest'
import { useRegisterForm } from '../../src/hooks/Pages/useRegisterForm'

// Mock vee-validate and registerUser
vi.mock('vee-validate', () => ({
  useField: () => ({
    value: { value: '' },
    errorMessage: { value: '' }
  }),
  useForm: () => ({
    handleSubmit: (fn: any) => fn
  })
}))

vi.mock('@/helpers/registerUser', () => ({
  registerUser: vi.fn()
}))

describe('useRegisterForm', () => {
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