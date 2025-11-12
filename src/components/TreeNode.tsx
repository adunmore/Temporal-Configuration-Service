import { useChildrenWithParts } from '../hooks/useChildrenWithParts'
import { usePart } from '../hooks/usePart'
import type { Configuration } from '../types/api'
import { ErrorDisplay } from './ErrorDisplay'

interface TreeNodeProps {
  config: Configuration
  expandedNodes: Set<string>
  onToggleExpanded: (uuid: string) => void
  onSelectConfig: (config: Configuration) => void
  selectedConfigId: string | null
}

export function TreeNode({
  config,
  expandedNodes,
  onToggleExpanded,
  onSelectConfig,
  selectedConfigId: selectedNodeId,
}: TreeNodeProps) {
  const isExpanded = expandedNodes.has(config.uuid)

  // Fetch children to know if node is expandable
  const {
    data: childrenWithParts,
    isLoading: childrenLoading,
    error: childrenError,
    refetch: refetchChildren,
  } = useChildrenWithParts(config.uuid)

  const { data: part, error: partError } = usePart(config.partUuid)

  // Determine what icon to show
  const hasChildren = childrenWithParts && childrenWithParts.length > 0
  const expandIcon = childrenLoading
    ? '⋯'
    : childrenError
    ? ''
    : hasChildren
    ? isExpanded
      ? '▼'
      : '▶'
    : ''

  const childErrorDisplay = childrenError ? (
    <ErrorDisplay
      error={childrenError}
      onRetry={() => refetchChildren()}
      title="Failed to Load Child Configurations"
    />
  ) : null

  return (
    <div>
      <div
        onClick={(e) => {
          e.stopPropagation()
          onSelectConfig(config)
        }}
        style={{
          cursor: 'pointer',
          padding: '4px 8px',
          fontWeight: selectedNodeId === config.uuid ? 'bold' : 'normal',
        }}
      >
        <span
          style={{ width: '16px', display: 'inline-block' }}
          onClick={(e) => {
            e.stopPropagation()
            if (hasChildren) {
              onToggleExpanded(config.uuid)
            }
          }}
        >
          {expandIcon}
        </span>
        <span>
          {partError ? (
            <span style={{ color: '#dc3545' }}>⚠️ Error loading part</span>
          ) : (
            part?.name || 'Loading...'
          )}
          {config.endUnitSerialNo && (
            <span style={{ color: '#666', marginLeft: '8px' }}>
              (Serial: {config.endUnitSerialNo})
            </span>
          )}
        </span>
      </div>
      {/* Show children error even when collapsed */}
      {childrenError ? (
        <div style={{ marginLeft: '20px', marginTop: '4px' }}>
          <ErrorDisplay
            error={childrenError}
            onRetry={() => refetchChildren()}
            title="Failed to Load Child Configurations"
          />
        </div>
      ) : (
        isExpanded && (
          <div style={{ marginLeft: '20px' }}>
            {childrenWithParts?.map(({ config: childConfig }) => (
              <TreeNode
                key={childConfig.uuid}
                config={childConfig}
                onToggleExpanded={onToggleExpanded}
                expandedNodes={expandedNodes}
                onSelectConfig={onSelectConfig}
                selectedConfigId={selectedNodeId}
              />
            ))}
          </div>
        )
      )}
    </div>
  )
}
