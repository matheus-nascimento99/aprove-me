import { Injectable } from '@nestjs/common'
import { FilterParams } from 'src/core/@types/filter-params'
import {
  PaginationParamsRequest,
  PaginationParamsResponse,
} from 'src/core/@types/pagination-params'
import { Either, right } from 'src/core/either'

import { Assignor } from '../../enterprise/entities/assignor'
import { AssignorsRepository } from '../repositories/assignors'

export type FetchAssignorsFilterParams = {
  name: string
  email: string
  phone: string
  document: string
}

type FetchAssignorsUseCaseRequest = {
  filterParams: FilterParams<FetchAssignorsFilterParams>
  paginationParams: PaginationParamsRequest
}

type FetchAssignorsUseCaseResponse = Either<
  null,
  PaginationParamsResponse<Assignor>
>
@Injectable()
export class FetchAssignorsUseCase {
  constructor(private assignorsRepository: AssignorsRepository) {}

  async execute({
    filterParams,
    paginationParams,
  }: FetchAssignorsUseCaseRequest): Promise<FetchAssignorsUseCaseResponse> {
    const assignors = await this.assignorsRepository.findMany(
      paginationParams,
      filterParams,
    )

    return right(assignors)
  }
}
