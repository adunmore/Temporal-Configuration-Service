import {
  TreeItem,
  TreeItemContent,
  Collection,
  Button,
} from 'react-aria-components'
import { useEffect } from 'react'
import { useChildrenWithParts } from '../hooks/useChildrenWithParts'
import { usePart } from '../hooks/usePart'
import type { Configuration } from '../types/api'
import { ErrorDisplay } from './ErrorDisplay'
import styles from './TreeNode.module.css'

interface ConfigNodeProps {
  config: Configuration
  registerConfig?: (config: Configuration) => void
  expandedKeys?: Set<string>
}

export function ConfigNode({
  config,
  registerConfig,
  expandedKeys,
}: ConfigNodeProps) {
  // Register this config for lookup when it mounts
  useEffect(() => {
    registerConfig?.(config)
  }, [config, registerConfig])

  const { data: part, error: partError } = usePart(config.partUuid)

  // Fetch children to know if node is expandable
  const {
    data: childrenWithParts,
    isLoading: childrenLoading,
    error: childrenError,
    refetch: refetchChildren,
  } = useChildrenWithParts(config.uuid)

  return (
    <TreeItem id={config.uuid} textValue={part?.name || 'Loading...'}>
      <TreeItemContent>
        {({ hasChildItems }) => (
          <>
            <div className={styles.nodeContent}>
              {/* Only render chevron if item has children */}
              {hasChildItems ? (
                <Button slot="chevron" className={styles.chevronButton}>
                  {childrenLoading ? (
                    <span className={styles.chevron}>⋯</span>
                  ) : childrenError ? (
                    <span className={styles.chevron}></span>
                  ) : (
                    <svg className={styles.chevronIcon} viewBox="0 0 24 24">
                      <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  )}
                </Button>
              ) : (
                <span className={styles.chevronSpacer} />
              )}

              <span className={styles.label}>
                {partError ? (
                  <span className={styles.error}>⚠️ Error loading part</span>
                ) : (
                  part?.name || 'Loading...'
                )}
                {config.endUnitSerialNo && (
                  <span className={styles.serial}>
                    (Serial: {config.endUnitSerialNo})
                  </span>
                )}
              </span>
            </div>
            {childrenError && (
              <div className={styles.childError}>
                <ErrorDisplay
                  error={childrenError}
                  onRetry={() => refetchChildren()}
                  title="Failed to Load Child Configurations"
                />
              </div>
            )}
          </>
        )}
      </TreeItemContent>
      {!childrenError && (
        <Collection
          items={childrenWithParts?.map((item) => ({
            ...item,
            id: item.config.uuid,
          }))}
        >
          {(item) => (
            <ConfigNode
              config={item.config}
              registerConfig={registerConfig}
              expandedKeys={expandedKeys}
            />
          )}
        </Collection>
      )}
    </TreeItem>
  )
}
