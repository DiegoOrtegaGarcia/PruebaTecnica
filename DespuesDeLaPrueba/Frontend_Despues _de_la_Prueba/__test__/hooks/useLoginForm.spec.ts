import { describe, it, expect, vi } from 'vitest'
import { useLoginForm } from '../../src/hooks/Pages/useLoginForm'

// Mock vee-validate and loginUser
vi.mock('vee-validate', () => ({
  useField: () => ({
    value: { value: '' },
    errorMessage: { value: '' }
  }),
  useForm: () => ({
    handleSubmit: (fn: any) => fn
  })
}))

vi.mock('@/helpers/loginUser', () => ({
  loginUser: vi.fn()
}))

describe('useLoginForm', () => {
  it('initializes form fields', () => {
    const alertMessage = vi.fn()
    const finishMessage = vi.fn()
    
    const { password, email, isLoading, submit } = useLoginForm(alertMessage, finishMessage)

    expect(password).toBeDefined()
    expect(email).toBeDefined()
    expect(isLoading.value).toBe(false)
    expect(typeof submit).toBe('function')
  })
})