import { apiClient } from './client'
import type { Configuration } from '../types/api'

export async function fetchChildren(
  parentUuid?: string | null
): Promise<Configuration[]> {
  const response = await apiClient.get<Configuration[]>(
    '/api/configs/children',
    { params: parentUuid ? { parentUuid } : {} }
  )

  return response.data
}
