import { useEffect, useState } from 'react'
import { usePart } from '../hooks/usePart'
import { usePartAllowableStatuses } from '../hooks/usePartAllowableStatuses'
import type { PartStatus } from '../types/api'
import { useUpdatePart } from '../hooks/useUpdatePart'
import { ErrorDisplay } from './ErrorDisplay'

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
      <div
        style={{
          padding: '2rem',
          minHeight: '160px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ color: '#555' }}>Loading part details...</div>
      </div>
    )
  }

  if (partError || !part) {
    return (
      <div style={{ padding: '1rem' }}>
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
    <div style={{ padding: '1rem' }}>
      <h3>{part.name}</h3>
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Part UUID:</strong> {part.uuid}
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Unit:</strong> {part.unit}
      </div>
      {part.version && (
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Version:</strong> {part.version}
        </div>
      )}

      <div style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
        <strong>Status:</strong>
      </div>

      {isEditing ? (
        <div>
          {allowableStatusesLoading ? (
            <div>Loading available statuses...</div>
          ) : allowableStatusesError ? (
            <ErrorDisplay
              error={allowableStatusesError}
              onRetry={() => refetchAllowableStatuses()}
              title="Failed to Load Status Options"
            />
          ) : (
            <>
              <select
                value={selectedStatus || ''}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as PartStatus)
                }
                style={{
                  padding: '0.25rem',
                  marginRight: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                {allowableStatuses?.allowableStatuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                    style={{
                      fontWeight: part.status === status ? 'bold' : 'normal',
                    }}
                  >
                    {status}
                  </option>
                ))}
              </select>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleSaveStatus()
                }}
                disabled={
                  selectedStatus === part.status || updatePartMutation.isPending
                }
                style={{
                  padding: '0.25rem 0.75rem',
                  marginRight: '0.5rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor:
                    selectedStatus === part.status ||
                    updatePartMutation.isPending
                      ? 'not-allowed'
                      : 'pointer',
                  opacity:
                    selectedStatus === part.status ||
                    updatePartMutation.isPending
                      ? 0.6
                      : 1,
                }}
              >
                {updatePartMutation.isPending ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setIsEditing(false)
                  setSelectedStatus(null)
                  updatePartMutation.reset()
                }}
                style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </>
          )}
          {updatePartMutation.isError && (
            <div style={{ marginTop: '0.5rem' }}>
              <ErrorDisplay
                error={updatePartMutation.error}
                title="Failed to Update Status"
              />
            </div>
          )}
        </div>
      ) : (
        <div>
          <span style={{ marginRight: '1rem' }}>{part.status}</span>
          <button
            onClick={(e) => {
              e.preventDefault()
              setSelectedStatus(part.status)
              setIsEditing(true)
            }}
            style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  )
}
