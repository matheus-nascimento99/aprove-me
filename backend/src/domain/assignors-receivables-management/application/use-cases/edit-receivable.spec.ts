import { faker } from '@faker-js/faker'
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found'
import { makeAssignor } from 'test/factories/make-assignor'
import { makeReceivable } from 'test/factories/make-receivable'
import { InMemoryAssignorsRepository } from 'test/in-memory-repositories/assignors'
import { InMemoryReceivablesRepository } from 'test/in-memory-repositories/receivables'

import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { EditReceivableUseCase } from './edit-receivable'

let inMemoryReceivablesRepository: InMemoryReceivablesRepository
let inMemoryAssignorsRepository: InMemoryAssignorsRepository
let sut: EditReceivableUseCase

describe('Edit receivable use case', () => {
  beforeEach(() => {
    inMemoryReceivablesRepository = new InMemoryReceivablesRepository()
    inMemoryAssignorsRepository = new InMemoryAssignorsRepository()
    sut = new EditReceivableUseCase(
      inMemoryReceivablesRepository,
      inMemoryAssignorsRepository,
    )
  })

  it('should be able to edit an receivable', async () => {
    const receivable = makeReceivable({})
    inMemoryReceivablesRepository.create(receivable)

    const assignor = makeAssignor({})
    inMemoryAssignorsRepository.create(assignor)

    const newReceivable = {
      assignor: assignor.id.toString(),
      value: faker.number.float(),
    }

    const result = await sut.execute({
      receivableId: receivable.id.toString(),
      ...newReceivable,
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryReceivablesRepository.items[0].assignor).toEqual(
      new UniqueEntityId(newReceivable.assignor),
    )
    expect(inMemoryReceivablesRepository.items[0].value).toEqual(
      newReceivable.value,
    )
  })

  it('should not be able to edit an unexistent receivable', async () => {
    const result = await sut.execute({
      receivableId: faker.string.uuid(),
      assignor: faker.string.uuid(),
      value: faker.number.float(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit an unexistent assignor', async () => {
    const receivable = makeReceivable({})
    inMemoryReceivablesRepository.create(receivable)

    const result = await sut.execute({
      receivableId: receivable.id.toString(),
      assignor: faker.string.uuid(),
      value: faker.number.float(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
