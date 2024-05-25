import { faker } from '@faker-js/faker'
import { FakeCryptographer } from 'test/cryptography/fake-cryptographer'
import { makeAssignor } from 'test/factories/make-assignor'
import { InMemoryAssignorsRepository } from 'test/in-memory-repositories/assignors'
import { InMemoryUsersRepository } from 'test/in-memory-repositories/users'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found'

import { RefreshTokenUseCase } from './refresh-token'

let sut: RefreshTokenUseCase
let fakeCryptographer: FakeCryptographer
let inMemoryAssignorsRepository: InMemoryAssignorsRepository
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Refresh token use case', () => {
  beforeEach(() => {
    fakeCryptographer = new FakeCryptographer()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryAssignorsRepository = new InMemoryAssignorsRepository(
      inMemoryUsersRepository,
    )

    sut = new RefreshTokenUseCase(
      inMemoryAssignorsRepository,
      fakeCryptographer,
    )
  })

  it('should be able to refresh token', async () => {
    const assignor = makeAssignor({})
    inMemoryAssignorsRepository.create(assignor)

    const result = await sut.execute({ user: { sub: assignor.id.toString() } })

    expect(result.isRight()).toEqual(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        refreshToken: expect.any(String),
      }),
    )
  })

  it('should not be able to refresh token of unexistent user', async () => {
    const result = await sut.execute({ user: { sub: faker.string.uuid() } })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
