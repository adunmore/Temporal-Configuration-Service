export interface Configuration {
  uuid: string
  partUuid: string
  endUnitSerialNo?: string | null
}

export type PartStatus =
  | 'configuration'
  | 'active'
  | 'draft'
  | 'deprecated'
  | 'obsolete'
  | 'experimental'
  | 'retired'
  | 'recalled'

export interface Part {
  uuid: string
  name: string
  version?: string | null
  status: PartStatus
  unit: string
}

export interface AllowableStatuses {
  partUuid: string
  currentStatus: PartStatus
  allowableStatuses: PartStatus[]
}

export interface PartUpdatePayload {
  unit?: string
  status?: PartStatus
}
