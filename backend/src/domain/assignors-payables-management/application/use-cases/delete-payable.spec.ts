import { faker } from '@faker-js/faker'
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found'
import { makePayable } from 'test/factories/make-payable'
import { InMemoryPayablesRepository } from 'test/in-memory-repositories/payables'

import { DeletePayableUseCase } from './delete-payable'

let inMemoryPayablesRepository: InMemoryPayablesRepository
let sut: DeletePayableUseCase

describe('Delete payable use case', () => {
  beforeEach(() => {
    inMemoryPayablesRepository = new InMemoryPayablesRepository()
    sut = new DeletePayableUseCase(inMemoryPayablesRepository)
  })

  it('should be able to delete an payable', async () => {
    const payable = makePayable({})
    inMemoryPayablesRepository.create(payable)

    const result = await sut.execute({
      payableId: payable.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryPayablesRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an unexistent payable', async () => {
    const result = await sut.execute({
      payableId: faker.string.uuid(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
