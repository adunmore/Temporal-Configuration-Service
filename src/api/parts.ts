import { apiClient } from './client'
import type { Part, AllowableStatuses, PartUpdatePayload } from '../types/api'

export async function fetchPart(partUuid: string): Promise<Part> {
  const response = await apiClient.get<Part>(`/api/parts/${partUuid}`)

  return response.data
}

export async function fetchPartAllowableStatuses(
  partUuid: string
): Promise<AllowableStatuses> {
  const response = await apiClient.get<AllowableStatuses>(
    `/api/parts/${partUuid}/allowable-statuses`
  )
  return response.data
}

export async function updatePart(
  partUuid: string,
  payload: PartUpdatePayload
): Promise<Part> {
  const response = await apiClient.put<Part>(`/api/parts/${partUuid}`, payload)
  return response.data
}
