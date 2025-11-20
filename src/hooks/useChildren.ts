import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchChildren } from '../api/configs'
import { fetchPart } from '../api/parts'

export function useChildren(parentUuid?: string | null) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['children', parentUuid ?? 'root'],
    queryFn: async () => {
      const children = await fetchChildren(parentUuid)

      // Eagerly prefetch parts to avoid loading states in child components
      await Promise.all(
        children.map((child) =>
          queryClient
            .prefetchQuery({
              queryKey: ['parts', child.partUuid],
              queryFn: () => fetchPart(child.partUuid),
              staleTime: 1000 * 60 * 5,
            })
            .catch((error) => {
              console.error(`Failed to prefetch part ${child.partUuid}:`, error)
            })
        )
      )

      return children
    },
    staleTime: 1000 * 60 * 5,
  })
}
