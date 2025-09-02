import type { AlertMessage, AlertStatus, userDataLoginForm } from '@/types/types'
import { useField, useForm } from 'vee-validate'
import { loginUser } from '@/helpers/loginUser'

export function useLoginForm (alertMessage: (response: AlertMessage) => void, finishMessage: (status: AlertStatus) => void) {
  const { handleSubmit } = useForm<userDataLoginForm>({
    validationSchema: {
      password (value: string) {
        if (value?.length >= 8) {
          return true
        }
        return 'Password must be at least 8 characters long.'
      },
      email (value: string) {
        if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) {
          return true
        }
        return 'Please enter a valid email address.'
      },
    },
  })
  const password = useField('password')
  const email = useField('email')

  const isLoading = ref(false)

  const submit = handleSubmit(async values => {
    const response = await loginUser(values, isLoading)
    alertMessage(response)
    finishMessage(response.status)
  })

  return {
    password, email, isLoading, submit,
  }
}
