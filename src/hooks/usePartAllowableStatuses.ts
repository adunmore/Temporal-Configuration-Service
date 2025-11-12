import { useQuery } from '@tanstack/react-query'
import { fetchPartAllowableStatuses } from '../api/parts'

export function usePartAllowableStatuses(partUuid: string) {
  return useQuery({
    queryKey: ['partAllowableStatuses', partUuid],
    queryFn: () => fetchPartAllowableStatuses(partUuid),
  })
}
