'use client'

import { useEffect } from 'react'
import { logError } from '@/lib/logError'

export default function GlobalErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      logError(window.location.pathname, event.message, event.error?.stack)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const message =
        event.reason instanceof Error ? event.reason.message : String(event.reason)
      const stack = event.reason instanceof Error ? event.reason.stack : undefined
      logError(window.location.pathname, message, stack)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null
}
