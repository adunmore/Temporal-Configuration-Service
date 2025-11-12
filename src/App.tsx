import { useEffect, useState } from 'react'
import { TimeMachineList } from './components/TimeMachineList'

import './App.css'
import { TreeNode } from './components/TreeNode'
import { PartViewer } from './components/PartViewer'
import type { Configuration } from './types/api'

function App() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  const [selectedMachine, setSelectedMachine] = useState<Configuration | null>(
    null
  )

  const [selectedConfig, setSelectedConfig] = useState<Configuration | null>(
    null
  )

  useEffect(() => {
    // When machine changes, auto-select it as the config
    setSelectedConfig(selectedMachine)
  }, [selectedMachine])

  const toggleExpanded = (configUuid: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(configUuid)) {
        next.delete(configUuid)
      } else {
        next.add(configUuid)
      }
      return next
    })
  }

  return (
    <div className="App">
      <h1>Temporal Control Interface</h1>
      <div className="ViewerColumns">
        <div className="ConfigContainer">
          <TimeMachineList
            selectedMachine={selectedMachine}
            onSelectMachine={setSelectedMachine}
          />
          <div>
            {selectedMachine && (
              <TreeNode
                config={selectedMachine}
                expandedNodes={expandedNodes}
                onToggleExpanded={toggleExpanded}
                onSelectConfig={setSelectedConfig}
                selectedConfigId={selectedConfig?.uuid ?? null}
              />
            )}
          </div>
        </div>
        {selectedConfig && (
          <div>
            <PartViewer partUuid={selectedConfig.partUuid} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
