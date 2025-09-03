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

export interface PeopleData {
  id: number
  name: string
  lastName: string
  age: string
  sex: string
  email: string
}

export interface FormFielStatus {
  name: boolean
  lastName: boolean
  age: boolean
  sex: boolean
  email: boolean
}
export interface SexOptions {
  male: string
  female: string
  other: string
}

// types/user.ts
export interface User {
  id: number
  name: string
  lastName: string
  age: number
  sex: string
  email: string
}

export interface UserTableProps {
  user: User
  userNationalities: Record<number, { country_id: string, probability: number }>
  onDeleteUser: (id: number) => void
  getSexColor: (sex: string) => string
  getSexLabel: (sex: string) => string
}
