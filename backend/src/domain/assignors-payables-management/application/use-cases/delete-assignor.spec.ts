import { faker } from '@faker-js/faker'
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found'
import { makeAssignor } from 'test/factories/make-assignor'
import { InMemoryAssignorsRepository } from 'test/in-memory-repositories/assignors'
import { InMemoryUsersRepository } from 'test/in-memory-repositories/users'

import { DeleteAssignorUseCase } from './delete-assignor'

let inMemoryAssignorsRepository: InMemoryAssignorsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: DeleteAssignorUseCase

describe('Delete assignor use case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryAssignorsRepository = new InMemoryAssignorsRepository(
      inMemoryUsersRepository,
    )
    sut = new DeleteAssignorUseCase(inMemoryAssignorsRepository)
  })

  it('should be able to delete an assignor', async () => {
    const assignor = makeAssignor({})
    inMemoryAssignorsRepository.create(assignor)

    const result = await sut.execute({
      assignorId: assignor.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryUsersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an unexistent assignor', async () => {
    const result = await sut.execute({
      assignorId: faker.string.uuid(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
