import {
  PaginationParamsRequest,
  PaginationParamsResponse,
} from 'src/core/@types/pagination-params'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'

import { FilterParams } from '@/core/@types/filter-params'

import { Receivable } from '../../enterprise/entities/receivable'
import { FetchReceivablesFilterParams } from '../use-cases/fetch-receivables'

export abstract class ReceivablesRepository {
  abstract create(receivable: Receivable): Promise<void>
  abstract findMany(
    paginationParams: PaginationParamsRequest,
    filterParams: FilterParams<FetchReceivablesFilterParams>,
  ): Promise<PaginationParamsResponse<Receivable>>

  abstract findById(receivableId: UniqueEntityId): Promise<Receivable | null>

  abstract save(
    receivableId: UniqueEntityId,
    receivable: Receivable,
  ): Promise<void>

  abstract delete(receivableId: UniqueEntityId): Promise<void>
}
