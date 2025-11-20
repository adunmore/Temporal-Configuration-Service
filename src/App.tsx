import { useEffect, useState, useRef } from 'react'
import { Tree, type Selection } from 'react-aria-components'

import './App.css'
import { ConfigurationNode } from './components/ConfigurationNode'
import { PartViewer } from './components/PartViewer'
import type { Configuration } from './types/api'
import { useChildren } from './hooks/useChildren'
import { ErrorDisplay } from './components/ErrorDisplay'

function App() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [selectedConfig, setSelectedConfig] = useState<Configuration | null>(
    null
  )
  const [selectedMachineId, setSelectedMachineId] = useState<string>('')

  // Load time machines directly
  const { data: timeMachines, isLoading, error, refetch } = useChildren(null)

  // Keep a lookup map of uuid -> config for selection sync
  // We'll update this as we render the tree
  const configLookupRef = useRef<Map<string, Configuration>>(new Map())

  // Register time machines in the lookup and auto-select first machine
  useEffect(() => {
    if (timeMachines && timeMachines.length > 0) {
      timeMachines.forEach((tm) => {
        configLookupRef.current.set(tm.uuid, tm)
      })
      // Auto-select first machine if none selected
      if (!selectedMachineId) {
        const firstMachine = timeMachines[0]
        setSelectedMachineId(firstMachine.uuid)
        setSelectedConfig(firstMachine)
      }
    }
  }, [timeMachines, selectedMachineId])

  // Auto-select the root machine node when machine changes and ensure it's expanded
  useEffect(() => {
    if (selectedMachineId) {
      const machine = configLookupRef.current.get(selectedMachineId)
      if (machine) {
        setSelectedConfig(machine)
        // Always keep the TimeMachine node expanded
        setExpandedNodes((prev) => new Set([...prev, selectedMachineId]))
      }
    }
  }, [selectedMachineId])

  // Register configs as they render so we can look them up
  const registerConfig = (config: Configuration) => {
    configLookupRef.current.set(config.uuid, config)
  }

  const handleSelectionChange = (keys: Selection) => {
    if (keys === 'all') return // Not applicable for tree

    const selectedKeys = Array.from(keys)
    if (selectedKeys.length > 0) {
      const uuid = selectedKeys[0] as string
      const config = configLookupRef.current.get(uuid)
      if (config) {
        setSelectedConfig(config)
      }
    } else {
      setSelectedConfig(null)
    }
  }

  const handleExpandedChange = (keys: Set<React.Key>) => {
    // Convert React.Key to string for our state
    const newExpandedNodes = new Set(Array.from(keys).map(String))
    // Always keep the TimeMachine node expanded
    if (selectedMachineId) {
      newExpandedNodes.add(selectedMachineId)
    }
    setExpandedNodes(newExpandedNodes)
  }

  if (isLoading) {
    return (
      <div className="App">
        <h1>Temporal Control Interface</h1>
        <div>Loading time machines...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="App">
        <h1>Temporal Control Interface</h1>
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
      <div className="App">
        <h1>Temporal Control Interface</h1>
        <div>No time machines available</div>
      </div>
    )
  }

  const selectedMachine = timeMachines?.find(
    (tm) => tm.uuid === selectedMachineId
  )

  return (
    <div className="App">
      <h1>Temporal Control Interface</h1>
      <div className="ViewerColumns">
        <div className="TreeColumn">
          <div className="MachineBox">
            <div className="MachineSelector">
              <label htmlFor="machine-selector">Time Machine</label>
              <select
                id="machine-selector"
                value={selectedMachineId}
                onChange={(e) => {
                  setSelectedMachineId(e.target.value)
                  setSelectedConfig(null)
                  setExpandedNodes(new Set())
                }}
              >
                {timeMachines?.map((tm) => (
                  <option key={tm.uuid} value={tm.uuid}>
                    {tm.endUnitSerialNo}
                  </option>
                ))}
              </select>
            </div>
            {selectedMachine && (
              <Tree
                key={selectedMachine.uuid}
                aria-label={`Configuration tree for ${
                  selectedMachine.endUnitSerialNo || 'selected machine'
                }`}
                selectionMode="single"
                selectedKeys={
                  selectedConfig ? new Set([selectedConfig.uuid]) : new Set()
                }
                onSelectionChange={handleSelectionChange}
                expandedKeys={expandedNodes}
                onExpandedChange={handleExpandedChange}
              >
                <ConfigurationNode
                  config={selectedMachine}
                  registerConfig={registerConfig}
                  expandedKeys={expandedNodes}
                  isTimeMachine={true}
                />
              </Tree>
            )}
          </div>
        </div>
        {selectedConfig && (
          <div className="PartViewerColumn">
            <PartViewer partUuid={selectedConfig.partUuid} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
