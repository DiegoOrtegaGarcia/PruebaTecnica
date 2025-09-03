import { describe, it, expect, vi } from 'vitest'
import { registerUser } from '@/helpers/registerUser'
import api from '@/axios/axios'

// Mock axios
vi.mock('@/axios/axios', () => ({
  default: {
    post: vi.fn()
  }
}))

// Mock store
vi.mock('@/stores/app', () => ({
  useAuthStore: () => ({
    setUser: vi.fn()
  })
}))

describe('registerUser', () => {
  const mockIsLoaded = { value: false }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('handles successful registration', async () => {
    const mockResponse = { data: { data: 'User created successfully' } }
    vi.mocked(api.post).mockResolvedValue(mockResponse)

    const result = await registerUser(
      { name: 'John', email: 'test@example.com', password: 'password' },
      mockIsLoaded
    )

    expect(result).toEqual({ text: 'User created successfully', status: 'success' })
  })

  it('handles 422 error (user already exists)', async () => {
    const mockError = {
      isAxiosError: true,
      response: { status: 422 }
    }
    vi.mocked(api.post).mockRejectedValue(mockError)

    const result = await registerUser(
      { name: 'John', email: 'test@example.com', password: 'password' },
      mockIsLoaded
    )

    expect(result).toEqual({ text: 'The User Already exists', status: 'error' })
  })
})