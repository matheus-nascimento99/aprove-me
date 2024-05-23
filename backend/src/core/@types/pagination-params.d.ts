export type PaginationParamsRequest = {
  page: number
  limit: number
}

export type PaginationParamsResponse<Entity> = {
  items: Entity[]
  total: number
  prev: number | null
  next: number | null
}
