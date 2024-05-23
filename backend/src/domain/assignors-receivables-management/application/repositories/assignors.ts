import {
  PaginationParamsRequest,
  PaginationParamsResponse,
} from 'src/core/@types/pagination-params'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'

import { FilterParams } from '@/core/@types/filter-params'

import { Assignor } from '../../enterprise/entities/assignor'
import { FetchAssignorsFilterParams } from '../use-cases/fetch-assignors'

export abstract class AssignorsRepository {
  abstract create(assignor: Assignor): Promise<void>
  abstract findMany(
    paginationParams: PaginationParamsRequest,
    filterParams: FilterParams<FetchAssignorsFilterParams>,
  ): Promise<PaginationParamsResponse<Assignor>>

  abstract findById(assignorId: UniqueEntityId): Promise<Assignor | null>
  abstract findByEmail(assignorEmail: string): Promise<Assignor | null>
  abstract findByPhone(assignorPhone: string): Promise<Assignor | null>
  abstract findByDocument(assignorDocument: string): Promise<Assignor | null>

  abstract save(assignorId: UniqueEntityId, assignor: Assignor): Promise<void>

  abstract delete(assignorId: UniqueEntityId): Promise<void>
}
