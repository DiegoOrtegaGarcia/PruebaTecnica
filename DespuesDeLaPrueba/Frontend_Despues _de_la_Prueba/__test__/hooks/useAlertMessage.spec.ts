import { describe, it, expect, vi } from 'vitest'
import { useAlerMessage } from '../../src/hooks/useAlertMessage'

describe('useAlertMessage', () => {
  it('manages alert messages correctly', () => {
    const redirectTo = vi.fn()
    const { isMessage, textMessage, alertMessage, finishMessage } = useAlerMessage('/test', redirectTo)

    // Test initial state
    expect(isMessage.value).toBe(false)
    expect(textMessage.value).toEqual({ text: '', status: undefined })

    // Test alertMessage
    const testAlert = { text: 'Test message', status: 'success' as const }
    alertMessage(testAlert)
    expect(textMessage.value).toEqual(testAlert)

    // Test finishMessage with success (uses setTimeout)
    vi.useFakeTimers()
    isMessage.value = true
    finishMessage('success')
    vi.advanceTimersByTime(3100)
    expect(isMessage.value).toBe(false)
    expect(redirectTo).toHaveBeenCalledWith('/test')
    vi.useRealTimers()
  })
})