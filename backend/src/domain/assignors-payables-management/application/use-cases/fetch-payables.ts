import { FilterParams } from 'src/core/@types/filter-params'
import {
  PaginationParamsRequest,
  PaginationParamsResponse,
} from 'src/core/@types/pagination-params'
import { Either, left, right } from 'src/core/either'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { Payable } from '../../enterprise/entities/payable'
import { AssignorsRepository } from '../repositories/assignors'
import { PayablesRepository } from '../repositories/payables'

export type FetchPayablesFilterParams = {} // eslint-disable-line

type FetchPayablesUseCaseRequest = {
  assignorId: string
  filterParams: FilterParams<FetchPayablesFilterParams>
  paginationParams: PaginationParamsRequest
}

type FetchPayablesUseCaseResponse = Either<
  ResourceNotFoundError,
  PaginationParamsResponse<Payable>
>

export class FetchPayablesUseCase {
  constructor(
    private payablesRepository: PayablesRepository,
    private assignorsRepository: AssignorsRepository,
  ) {}

  async execute({
    assignorId,
    filterParams,
    paginationParams,
  }: FetchPayablesUseCaseRequest): Promise<FetchPayablesUseCaseResponse> {
    const assignor = await this.assignorsRepository.findById(
      new UniqueEntityId(assignorId),
    )

    if (!assignor) {
      return left(new ResourceNotFoundError(assignorId))
    }

    const { items, total, next, prev } =
      await this.payablesRepository.findManyByAssignorId(
        new UniqueEntityId(assignorId),
        paginationParams,
        filterParams,
      )

    return right({ items, total, next, prev })
  }
}
