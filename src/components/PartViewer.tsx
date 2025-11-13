import { useEffect, useState } from 'react'
import { usePart } from '../hooks/usePart'
import { usePartAllowableStatuses } from '../hooks/usePartAllowableStatuses'
import type { PartStatus } from '../types/api'
import { useUpdatePart } from '../hooks/useUpdatePart'
import { ErrorDisplay } from './ErrorDisplay'
import styles from './PartViewer.module.css'

interface PartViewerProps {
  partUuid: string
}

export function PartViewer({ partUuid }: PartViewerProps) {
  const {
    data: part,
    isLoading: partIsLoading,
    error: partError,
    refetch: refetchPart,
  } = usePart(partUuid)
  const {
    data: allowableStatuses,
    isLoading: allowableStatusesLoading,
    error: allowableStatusesError,
    refetch: refetchAllowableStatuses,
  } = usePartAllowableStatuses(partUuid)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<PartStatus | null>(null)

  useEffect(() => {
    setIsEditing(false)
    setSelectedStatus(null)
  }, [partUuid])

  const updatePartMutation = useUpdatePart(partUuid)

  if (partIsLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingText}>Loading part details...</div>
      </div>
    )
  }

  if (partError || !part) {
    return (
      <div className={styles.errorContainer}>
        <ErrorDisplay
          error={partError || new Error('Part not found')}
          onRetry={() => refetchPart()}
          title="Failed to Load Part Details"
        />
      </div>
    )
  }

  const handleSaveStatus = async () => {
    if (selectedStatus && selectedStatus !== part.status) {
      updatePartMutation.mutate(
        { status: selectedStatus },
        {
          onSuccess: () => {
            setIsEditing(false)
            setSelectedStatus(null)
          },
        }
      )
    }
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{part.name}</h3>
      <div className={styles.field}>
        <span className={styles.label}>Part UUID:</span> {part.uuid}
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Unit:</span> {part.unit}
      </div>
      {part.version && (
        <div className={styles.field}>
          <span className={styles.label}>Version:</span> {part.version}
        </div>
      )}

      <div className={styles.statusSection}>
        <span className={styles.label}>Status:</span>
      </div>

      {isEditing ? (
        <div className={styles.statusEditor}>
          {allowableStatusesLoading ? (
            <div className={styles.loadingText}>Loading available statuses...</div>
          ) : allowableStatusesError ? (
            <ErrorDisplay
              error={allowableStatusesError}
              onRetry={() => refetchAllowableStatuses()}
              title="Failed to Load Status Options"
            />
          ) : (
            <div className={styles.statusControls}>
              <select
                className={styles.select}
                value={selectedStatus || ''}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as PartStatus)
                }
              >
                {allowableStatuses?.allowableStatuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                    className={
                      part.status === status
                        ? styles.selectOptionCurrent
                        : styles.selectOption
                    }
                  >
                    {status}
                  </option>
                ))}
              </select>
              <button
                className={styles.buttonSuccess}
                onClick={(e) => {
                  e.preventDefault()
                  handleSaveStatus()
                }}
                disabled={
                  selectedStatus === part.status || updatePartMutation.isPending
                }
              >
                {updatePartMutation.isPending ? 'Saving...' : 'Save'}
              </button>
              <button
                className={styles.buttonSecondary}
                onClick={(e) => {
                  e.preventDefault()
                  setIsEditing(false)
                  setSelectedStatus(null)
                  updatePartMutation.reset()
                }}
              >
                Cancel
              </button>
            </div>
          )}
          {updatePartMutation.isError && (
            <div className={styles.errorMessage}>
              <ErrorDisplay
                error={updatePartMutation.error}
                title="Failed to Update Status"
              />
            </div>
          )}
        </div>
      ) : (
        <div className={styles.statusDisplay}>
          <span className={styles.statusValue}>{part.status}</span>
          <button
            className={styles.buttonPrimary}
            onClick={(e) => {
              e.preventDefault()
              setSelectedStatus(part.status)
              setIsEditing(true)
            }}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  )
}
