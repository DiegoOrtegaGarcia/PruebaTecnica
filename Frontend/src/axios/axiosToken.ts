import axios from 'axios'
import { getAuthToken } from '@/helpers/tokenHelpers'

const apiTokens = axios.create({
  baseURL: 'http://localhost:8000/api/people', // URL base
  timeout: 5000, // Tiempo máximo de espera
  headers: { 'Content-Type': 'application/json' },
})

apiTokens.interceptors.request.use(
  config => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

export default apiTokens
