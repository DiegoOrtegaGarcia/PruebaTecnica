type AlertStatus = 'success' | 'error' | 'info' | 'warning' | undefined

export interface AlertMessage {
  text: string
  status: AlertStatus
}

export interface userDataRegisterForm {
  name: string
  email: string
  password: string
}

export interface userData {
  name: string
  email: string
}
export interface userDataLoginForm {
  email: string
  password: string
}

export interface ApiErrorResponse {
  message: string
}
