import type { AlertMessage, AlertStatus } from '@/types/types'

export function useAlerMessage (redirectPath: string, redirectTo: (path: string) => void) {
  const isMessage = ref(false)
  const textMessage = ref<AlertMessage>({ text: '', status: undefined })

  const alertMessage = (response: AlertMessage) => {
    textMessage.value.text = response.text
    textMessage.value.status = response.status
    isMessage.value = true
  }

  const finishMessage = (status: AlertStatus) => {
    setTimeout(() => {
      isMessage.value = false
      if (status === 'success') {
        redirectTo(redirectPath)
      }
    }, 3000)
  }

  return {
    isMessage, textMessage, alertMessage, finishMessage,
  }
}
