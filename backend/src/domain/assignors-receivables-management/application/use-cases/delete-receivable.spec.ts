import { faker } from '@faker-js/faker'
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found'
import { makeReceivable } from 'test/factories/make-receivable'
import { InMemoryReceivablesRepository } from 'test/in-memory-repositories/receivables'

import { DeleteReceivableUseCase } from './delete-receivable'

let inMemoryReceivablesRepository: InMemoryReceivablesRepository
let sut: DeleteReceivableUseCase

describe('Delete receivable use case', () => {
  beforeEach(() => {
    inMemoryReceivablesRepository = new InMemoryReceivablesRepository()
    sut = new DeleteReceivableUseCase(inMemoryReceivablesRepository)
  })

  it('should be able to delete an receivable', async () => {
    const receivable = makeReceivable({})
    inMemoryReceivablesRepository.create(receivable)

    const result = await sut.execute({
      receivableId: receivable.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryReceivablesRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an unexistent receivable', async () => {
    const result = await sut.execute({
      receivableId: faker.string.uuid(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
