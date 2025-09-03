import type { AlertMessage, AlertStatus, userDataRegisterForm } from '@/types/types'
import { useField, useForm } from 'vee-validate'
import { registerUser } from '@/helpers/registerUser'

export function useRegisterForm (alertMessage: (response: AlertMessage) => void, finishMessage: (status: AlertStatus) => void) {
  const { handleSubmit } = useForm<userDataRegisterForm>({
    validationSchema: {
      name (value: string) {
        if (value?.length >= 5) {
          return true
        }
        return 'Name must be at least 5 characters'
      },
      email (value: string) {
        if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) {
          return true
        }
        return 'Please enter a valid email address'
      },
      password (value: string) {
        if (value?.length >= 8) {
          return true
        }
        return 'Password must be at least 8 characters'
      },
    },
  })

  const name = useField('name')
  const email = useField('email')
  const password = useField('password')
  const isLoading = ref(false)

  const submit = handleSubmit(async values => {
    const response = await registerUser(values, isLoading)
    alertMessage(response)
    finishMessage(response.status)
  })

  return {
    name, email, password, isLoading, submit,
  }
}
