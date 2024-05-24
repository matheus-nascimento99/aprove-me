import { faker } from '@faker-js/faker'
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found'
import { makeAssignor } from 'test/factories/make-assignor'
import { makePayable } from 'test/factories/make-payable'
import { InMemoryAssignorsRepository } from 'test/in-memory-repositories/assignors'
import { InMemoryPayablesRepository } from 'test/in-memory-repositories/payables'
import { InMemoryUsersRepository } from 'test/in-memory-repositories/users'

import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { EditPayableUseCase } from './edit-payable'

let inMemoryPayablesRepository: InMemoryPayablesRepository
let inMemoryAssignorsRepository: InMemoryAssignorsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: EditPayableUseCase

describe('Edit payable use case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryPayablesRepository = new InMemoryPayablesRepository()
    inMemoryAssignorsRepository = new InMemoryAssignorsRepository(
      inMemoryUsersRepository,
    )
    sut = new EditPayableUseCase(
      inMemoryPayablesRepository,
      inMemoryAssignorsRepository,
    )
  })

  it('should be able to edit an payable', async () => {
    const payable = makePayable({})
    inMemoryPayablesRepository.create(payable)

    const assignor = makeAssignor({})
    inMemoryAssignorsRepository.create(assignor)

    const newPayable = {
      assignor: assignor.id.toString(),
      value: faker.number.float(),
    }

    const result = await sut.execute({
      payableId: payable.id.toString(),
      ...newPayable,
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryPayablesRepository.items[0].assignor).toEqual(
      new UniqueEntityId(newPayable.assignor),
    )
    expect(inMemoryPayablesRepository.items[0].value).toEqual(
      newPayable.value,
    )
  })

  it('should not be able to edit an unexistent payable', async () => {
    const result = await sut.execute({
      payableId: faker.string.uuid(),
      assignor: faker.string.uuid(),
      value: faker.number.float(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit an unexistent assignor', async () => {
    const payable = makePayable({})
    inMemoryPayablesRepository.create(payable)

    const result = await sut.execute({
      payableId: payable.id.toString(),
      assignor: faker.string.uuid(),
      value: faker.number.float(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
