import { faker } from '@faker-js/faker'
import { makeAssignor } from 'test/factories/make-assignor'
import { InMemoryAssignorsRepository } from 'test/in-memory-repositories/assignors'
import { InMemoryReceivablesRepository } from 'test/in-memory-repositories/receivables'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found'

import { CreateReceivableUseCase } from './create-receivable'

let inMemoryReceivablesRepository: InMemoryReceivablesRepository
let inMememoryAssignorsRepository: InMemoryAssignorsRepository
let sut: CreateReceivableUseCase

describe('Create receivable use case', () => {
  beforeEach(() => {
    inMemoryReceivablesRepository = new InMemoryReceivablesRepository()
    inMememoryAssignorsRepository = new InMemoryAssignorsRepository()
    sut = new CreateReceivableUseCase(
      inMemoryReceivablesRepository,
      inMememoryAssignorsRepository,
    )
  })

  it('should be able to create an receivable', async () => {
    const assignor = makeAssignor({})
    inMememoryAssignorsRepository.create(assignor)

    const result = await sut.execute({
      assignor: assignor.id.toString(),
      value: faker.number.float(),
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryReceivablesRepository.items).toHaveLength(1)
  })

  it('should not be able to create an receivable with an unexistent assignor', async () => {
    const result = await sut.execute({
      assignor: faker.string.uuid(),
      value: faker.number.float(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
