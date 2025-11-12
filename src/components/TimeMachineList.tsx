import { useChildren } from '../hooks/useChildren'
import type { Configuration } from '../types/api'
import { ErrorDisplay } from './ErrorDisplay'

interface TimeMachineListProps {
  selectedMachine: Configuration | null
  onSelectMachine: (machine: Configuration) => void
}

export function TimeMachineList({
  selectedMachine,
  onSelectMachine,
}: TimeMachineListProps) {
  const { data: timeMachines, isLoading, error, refetch } = useChildren(null)

  if (isLoading) {
    return (
      <div style={{ padding: '1rem' }}>
        <div>Loading time machines...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '1rem' }}>
        <h2>Time Machines</h2>
        <ErrorDisplay
          error={error}
          onRetry={() => refetch()}
          title="Failed to Load Time Machines"
        />
      </div>
    )
  }

  if (!timeMachines || timeMachines.length === 0) {
    return (
      <div style={{ padding: '1rem' }}>
        <h2>Time Machines</h2>
        <div style={{ color: '#666', fontStyle: 'italic' }}>
          No time machines available
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2>Time Machines</h2>
      <ul>
        {timeMachines.map((tm) => (
          <li
            key={tm.uuid}
            onClick={() => onSelectMachine(tm)}
            style={{
              cursor: 'pointer',
              fontWeight: selectedMachine?.uuid === tm.uuid ? 'bold' : 'normal',
            }}
          >
            Serial: {tm.endUnitSerialNo} (UUID: {tm.uuid.slice(0, 8)}...)
          </li>
        ))}
      </ul>
    </div>
  )
}
