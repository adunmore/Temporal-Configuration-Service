import { useQuery } from '@tanstack/react-query'
import { fetchPart } from '../api/parts'

export function usePart(partUuid: string) {
  return useQuery({
    queryKey: ['parts', partUuid],
    queryFn: () => fetchPart(partUuid),
  })
}
