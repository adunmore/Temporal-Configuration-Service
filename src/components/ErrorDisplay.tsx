import { getErrorMessage } from '../utils/errors'

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
    <div
      style={{
        padding: '1rem',
        border: '1px solid #dc3545',
        borderRadius: '4px',
        backgroundColor: '#fff5f5',
        color: '#721c24',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
        ⚠️ {title}
      </div>
      <div style={{ marginBottom: onRetry ? '1rem' : 0 }}>{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '0.25rem 0.75rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          Retry
        </button>
      )}
    </div>
  )
}
