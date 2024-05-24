import { faker } from '@faker-js/faker'
import { PaginationParamsResponse } from 'src/core/@types/pagination-params'
import { makeAssignor } from 'test/factories/make-assignor'
import { makePayable } from 'test/factories/make-payable'
import { InMemoryAssignorsRepository } from 'test/in-memory-repositories/assignors'
import { InMemoryPayablesRepository } from 'test/in-memory-repositories/payables'
import { InMemoryUsersRepository } from 'test/in-memory-repositories/users'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found'

import { Payable } from '../../enterprise/entities/payable'
import { FetchPayablesUseCase } from './fetch-payables'

let sut: FetchPayablesUseCase
let inMemoryPayablesRepository: InMemoryPayablesRepository
let inMemoryAssignorsRepository: InMemoryAssignorsRepository
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Fetch payables use case', () => {
  beforeEach(() => {
    inMemoryPayablesRepository = new InMemoryPayablesRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryAssignorsRepository = new InMemoryAssignorsRepository(
      inMemoryUsersRepository,
    )

    sut = new FetchPayablesUseCase(
      inMemoryPayablesRepository,
      inMemoryAssignorsRepository,
    )
  })

  it('should be able to fetch payables', async () => {
    const assignor = makeAssignor({})
    inMemoryAssignorsRepository.create(assignor)

    for (let index = 0; index < 4; index++) {
      const payable = makePayable(index < 3 ? { assignor: assignor.id } : {})
      inMemoryPayablesRepository.create(payable)
    }

    const result = await sut.execute({
      assignorId: assignor.id.toString(),
      paginationParams: { page: 1, limit: 3 },
      filterParams: {},
    })

    expect(result.isRight()).toEqual(true)
    expect(
      (result.value as PaginationParamsResponse<Payable>).items,
    ).toHaveLength(3)
  })

  it('should not be able to fetch payables with unexistent assignor', async () => {
    for (let index = 0; index < 4; index++) {
      const payable = makePayable({})
      inMemoryPayablesRepository.create(payable)
    }

    const result = await sut.execute({
      assignorId: faker.string.uuid(),
      paginationParams: { page: 1, limit: 3 },
      filterParams: {},
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to fetch payables paginated', async () => {
    const assignor = makeAssignor({})
    inMemoryAssignorsRepository.create(assignor)

    for (let index = 0; index < 4; index++) {
      const payable = makePayable(index < 3 ? { assignor: assignor.id } : {})
      inMemoryPayablesRepository.create(payable)
    }

    const result = await sut.execute({
      assignorId: assignor.id.toString(),
      paginationParams: { page: 2, limit: 2 },
      filterParams: {},
    })

    expect(result.isRight()).toEqual(true)
    expect(
      (result.value as PaginationParamsResponse<Payable>).items,
    ).toHaveLength(1)
  })
})
