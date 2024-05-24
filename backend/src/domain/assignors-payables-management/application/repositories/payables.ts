import {
  PaginationParamsRequest,
  PaginationParamsResponse,
} from 'src/core/@types/pagination-params'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'

import { FilterParams } from '@/core/@types/filter-params'

import { Payable } from '../../enterprise/entities/payable'
import { FetchPayablesFilterParams } from '../use-cases/fetch-payables'

export abstract class PayablesRepository {
  abstract create(payable: Payable): Promise<void>
  abstract findManyByAssignorId(
    assignorId: UniqueEntityId,
    paginationParams: PaginationParamsRequest,
    filterParams: FilterParams<FetchPayablesFilterParams>,
  ): Promise<PaginationParamsResponse<Payable>>

  abstract findById(payableId: UniqueEntityId): Promise<Payable | null>

  abstract save(payableId: UniqueEntityId, payable: Payable): Promise<void>

  abstract delete(payableId: UniqueEntityId): Promise<void>
}
