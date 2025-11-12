import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchChildren } from '../api/configs'
import { fetchPart } from '../api/parts'
import type { Configuration, Part } from '../types/api'

export interface ConfigWithPart {
  config: Configuration
  part: Part | null
}

/**
 * Fetch children configs and their associated parts in parallel
 * Uses ensureQueryData to populate React Query's cache for individual parts
 * This prevents flickering and enables cache reuse across the app
 */
export function useChildrenWithParts(parentUuid?: string | null) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['childrenWithParts', parentUuid ?? 'root'],
    queryFn: async (): Promise<ConfigWithPart[]> => {
      const children = await fetchChildren(parentUuid)

      // Fetch all parts in parallel and populate the cache
      // ensureQueryData will use cached data if available, or fetch if not
      const parts = await Promise.all(
        children.map((config) =>
          queryClient
            .ensureQueryData({
              queryKey: ['parts', config.partUuid],
              queryFn: () => fetchPart(config.partUuid),
              staleTime: 1000 * 60 * 5,
            })
            .catch((error) => {
              console.error(`Failed to fetch part ${config.partUuid}:`, error)
              return null
            })
        )
      )

      // Combine configs with their parts
      return children.map((config, i) => ({
        config,
        part: parts[i],
      }))
    },
    // Keep data fresh for 5 minutes
    staleTime: 1000 * 60 * 5,
  })
}
