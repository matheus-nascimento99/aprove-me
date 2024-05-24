import { faker } from '@faker-js/faker'
import { FakeCryptographer } from 'test/cryptography/fake-cryptographer'
import { makeAssignor } from 'test/factories/make-assignor'
import { FakeHasher } from 'test/hash/fake-hasher'
import { InMemoryAssignorsRepository } from 'test/in-memory-repositories/assignors'
import { InMemoryUsersRepository } from 'test/in-memory-repositories/users'

import { User, UserProps } from '../../enterprise/entities/user'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryAssignorsRepository: InMemoryAssignorsRepository
let fakeHasher: FakeHasher
let fakeCryptographer: FakeCryptographer
let sut: AuthenticateUseCase

describe('Authenticate use case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryAssignorsRepository = new InMemoryAssignorsRepository(
      inMemoryUsersRepository,
    )
    fakeHasher = new FakeHasher()
    fakeCryptographer = new FakeCryptographer()

    sut = new AuthenticateUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeCryptographer,
    )
  })
  it('should be able to authenticate with email', async () => {
    const password = 'email'
    const user = makeAssignor({ password: await fakeHasher.hash(password) })
    inMemoryAssignorsRepository.create(user)

    const result = await sut.execute({
      login: user.email,
      password,
    })

    expect(result.isRight()).toEqual(true)
    expect(
      (
        result.value as {
          user: Omit<User<UserProps>, 'password'>
          token: string
        }
      ).token,
    ).toEqual(expect.any(String))
  })

  it('should be able to authenticate with document', async () => {
    const password = 'document'
    const user = makeAssignor({ password: await fakeHasher.hash(password) })
    inMemoryAssignorsRepository.create(user)

    const result = await sut.execute({
      login: user.document.value,
      password,
    })

    expect(result.isRight()).toEqual(true)
    expect(
      (
        result.value as {
          user: Omit<User<UserProps>, 'password'>
          token: string
        }
      ).token,
    ).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong login', async () => {
    const password = 'document'
    const user = makeAssignor({ password: await fakeHasher.hash(password) })
    inMemoryAssignorsRepository.create(user)

    const result = await sut.execute({
      login: faker.internet.email(),
      password,
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const password = 'document'
    const user = makeAssignor({ password: await fakeHasher.hash(password) })
    inMemoryAssignorsRepository.create(user)

    const result = await sut.execute({
      login: user.email,
      password: faker.internet.password(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
