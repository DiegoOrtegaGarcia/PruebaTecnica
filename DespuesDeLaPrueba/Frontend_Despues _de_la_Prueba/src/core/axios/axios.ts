import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // URL base
  timeout: 5000, // Tiempo máximo de espera
  headers: { 'Content-Type': 'application/json' },
})

export default api
