import { faker } from '@faker-js/faker'
import { makeAssignor } from 'test/factories/make-assignor'
import { FakeHasher } from 'test/hash/fake-hasher'
import { InMemoryAssignorsRepository } from 'test/in-memory-repositories/assignors'

import { CreateAssignorUseCase } from './create-assignor'
import { AssignorWithSameDocumentAlreadyExistsError } from './errors/assignor-with-same-document-already-exists'
import { AssignorWithSameEmailAlreadyExistsError } from './errors/assignor-with-same-email-already-exists'
import { AssignorWithSamePhoneAlreadyExistsError } from './errors/assignor-with-same-phone-already-exists'

let inMemoryAssignorsRepository: InMemoryAssignorsRepository
let fakeHasher: FakeHasher
let sut: CreateAssignorUseCase

describe('Create assignor use case', () => {
  beforeEach(() => {
    inMemoryAssignorsRepository = new InMemoryAssignorsRepository()
    fakeHasher = new FakeHasher()

    sut = new CreateAssignorUseCase(inMemoryAssignorsRepository, fakeHasher)
  })

  it('should be able to create an assignor', async () => {
    const result = await sut.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      password: faker.internet.password(),
      document: String(faker.number.int({ min: 11, max: 14 })),
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryAssignorsRepository.items).toHaveLength(1)
  })

  it('should not be able to create an assignor with same email of already existent one', async () => {
    const assignor = makeAssignor({})
    inMemoryAssignorsRepository.create(assignor)

    const result = await sut.execute({
      name: faker.person.fullName(),
      email: assignor.email,
      phone: faker.phone.number(),
      password: faker.internet.password(),
      document: String(faker.number.int({ min: 11, max: 14 })),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(AssignorWithSameEmailAlreadyExistsError)
  })

  it('should not be able to create an assignor with same phone of already existent one', async () => {
    const assignor = makeAssignor({})
    inMemoryAssignorsRepository.create(assignor)

    const result = await sut.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: assignor.phone.value,
      password: faker.internet.password(),
      document: String(faker.number.int({ min: 11, max: 14 })),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(AssignorWithSamePhoneAlreadyExistsError)
  })

  it('should not be able to create an assignor with same document of already existent one', async () => {
    const assignor = makeAssignor({})
    inMemoryAssignorsRepository.create(assignor)

    const result = await sut.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      password: faker.internet.password(),
      document: assignor.document.value,
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(
      AssignorWithSameDocumentAlreadyExistsError,
    )
  })
})
