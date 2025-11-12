import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePart } from '../api/parts'
import type { Part, PartUpdatePayload } from '../types/api'

export function useUpdatePart(partUuid: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PartUpdatePayload) => updatePart(partUuid, payload),

    onMutate: async (payload) => {
      // Cancel outgoing queries to prevent overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['parts', partUuid] })
      
      // Snapshot previous value
      const previousPart = queryClient.getQueryData<Part>(['parts', partUuid])

      // Optimistically update
      if (previousPart) {
        queryClient.setQueryData<Part>(['parts', partUuid], {
          ...previousPart,
          ...payload,
        })
      }

      // Return context for rollback
      return { previousPart }
    },

    // Rollback on error
    onError: (_error, _payload, context) => {
      if (context?.previousPart) {
        queryClient.setQueryData(['parts', partUuid], context.previousPart)
      }
    },

    // Refetch to ensure sync with server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['parts', partUuid] })
      queryClient.invalidateQueries({
        queryKey: ['partAllowableStatuses', partUuid],
      })
    },
  })
}
