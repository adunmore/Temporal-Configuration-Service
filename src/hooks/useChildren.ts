import { useQuery } from '@tanstack/react-query'
import { fetchChildren } from '../api/configs'

export function useChildren(parentUuid?: string | null) {
  return useQuery({
    queryKey: ['children', parentUuid ?? 'root'],
    queryFn: () => fetchChildren(parentUuid),
  })
}
