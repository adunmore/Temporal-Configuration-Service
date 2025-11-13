import { getErrorMessage } from '../utils/errors'
import styles from './ErrorDisplay.module.css'

interface ErrorDisplayProps {
  error: unknown
  onRetry?: () => void
  title?: string
}

/**
 * Reusable component for displaying error messages with optional retry
 */
export function ErrorDisplay({ error, onRetry, title = 'Error' }: ErrorDisplayProps) {
  const message = getErrorMessage(error)

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        ⚠️ {title}
      </div>
      <div className={onRetry ? styles.messageWithButton : styles.message}>
        {message}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className={styles.retryButton}
        >
          Retry
        </button>
      )}
    </div>
  )
}
