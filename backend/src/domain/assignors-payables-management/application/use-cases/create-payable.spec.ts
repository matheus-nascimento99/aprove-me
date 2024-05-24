import { faker } from '@faker-js/faker'
import { makeAssignor } from 'test/factories/make-assignor'
import { InMemoryAssignorsRepository } from 'test/in-memory-repositories/assignors'
import { InMemoryPayablesRepository } from 'test/in-memory-repositories/payables'
import { InMemoryUsersRepository } from 'test/in-memory-repositories/users'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found'

import { CreatePayableUseCase } from './create-payable'

let inMemoryPayablesRepository: InMemoryPayablesRepository
let inMememoryAssignorsRepository: InMemoryAssignorsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: CreatePayableUseCase

describe('Create payable use case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryPayablesRepository = new InMemoryPayablesRepository()
    inMememoryAssignorsRepository = new InMemoryAssignorsRepository(
      inMemoryUsersRepository,
    )
    sut = new CreatePayableUseCase(
      inMemoryPayablesRepository,
      inMememoryAssignorsRepository,
    )
  })

  it('should be able to create an payable', async () => {
    const assignor = makeAssignor({})
    inMememoryAssignorsRepository.create(assignor)

    const result = await sut.execute({
      assignor: assignor.id.toString(),
      value: faker.number.float(),
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryPayablesRepository.items).toHaveLength(1)
  })

  it('should not be able to create an payable with an unexistent assignor', async () => {
    const result = await sut.execute({
      assignor: faker.string.uuid(),
      value: faker.number.float(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
