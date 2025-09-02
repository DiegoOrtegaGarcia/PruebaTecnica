import Cookies from 'js-cookie'

// Guardar token después de login
export const setAuthToken = (token: string, expiresDays = 1) => {
  Cookies.set('authToken', token, {
    expires: expiresDays,
    path: '/',
    sameSite: 'strict', // Protección CSRF
  })
}

// Obtener token
export const getAuthToken = () => {
  return Cookies.get('authToken')
}

// Eliminar token (logout)
export const removeAuthToken = () => {
  Cookies.remove('authToken', { path: '/' })
}

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return !!getAuthToken()
}
