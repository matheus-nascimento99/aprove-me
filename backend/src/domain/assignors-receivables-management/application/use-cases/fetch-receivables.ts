import { FilterParams } from 'src/core/@types/filter-params'
import {
  PaginationParamsRequest,
  PaginationParamsResponse,
} from 'src/core/@types/pagination-params'
import { Either, right } from 'src/core/either'

import { Receivable } from '../../enterprise/entities/receivable'
import { ReceivablesRepository } from '../repositories/receivables'

export type FetchReceivablesFilterParams = {
  assignor: string
}

type FetchReceivablesUseCaseRequest = {
  filterParams: FilterParams<FetchReceivablesFilterParams>
  paginationParams: PaginationParamsRequest
}

type FetchReceivablesUseCaseResponse = Either<
  unknown,
  PaginationParamsResponse<Receivable>
>

export class FetchReceivablesUseCase {
  constructor(private receivablesRepository: ReceivablesRepository) {}

  async execute({
    filterParams,
    paginationParams,
  }: FetchReceivablesUseCaseRequest): Promise<FetchReceivablesUseCaseResponse> {
    const { items, total, next, prev } =
      await this.receivablesRepository.findMany(paginationParams, filterParams)

    return right({ items, total, next, prev })
  }
}
