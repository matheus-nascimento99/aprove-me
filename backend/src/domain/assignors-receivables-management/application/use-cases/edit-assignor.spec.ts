import { faker } from '@faker-js/faker'
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found'
import { makeAssignor } from 'test/factories/make-assignor'
import { InMemoryAssignorsRepository } from 'test/in-memory-repositories/assignors'

import { Raw } from '@/core/value-objects/raw'

import { EditAssignorUseCase } from './edit-assignor'
import { AssignorWithSameDocumentAlreadyExistsError } from './errors/assignor-with-same-document-already-exists'
import { AssignorWithSameEmailAlreadyExistsError } from './errors/assignor-with-same-email-already-exists'
import { AssignorWithSamePhoneAlreadyExistsError } from './errors/assignor-with-same-phone-already-exists'

let inMemoryAssignorsRepository: InMemoryAssignorsRepository
let sut: EditAssignorUseCase

describe('Edit assignor use case', () => {
  beforeEach(() => {
    inMemoryAssignorsRepository = new InMemoryAssignorsRepository()
    sut = new EditAssignorUseCase(inMemoryAssignorsRepository)
  })

  it('should be able to edit an assignor', async () => {
    const assignor = makeAssignor({})
    inMemoryAssignorsRepository.create(assignor)

    const newAssignor = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      document: String(faker.number.int({ min: 11, max: 14 })),
    }

    const result = await sut.execute({
      assignorId: assignor.id.toString(),
      ...newAssignor,
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryAssignorsRepository.items[0]).toEqual(
      expect.objectContaining({
        name: newAssignor.name,
        email: newAssignor.email,
        phone: Raw.createFromText(newAssignor.phone),
        document: Raw.create(newAssignor.document),
      }),
    )
  })

  it('should not be able to edit an unexistent assignor', async () => {
    const result = await sut.execute({
      assignorId: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      document: String(faker.number.int({ min: 11, max: 14 })),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit an assignor with same email of one that is already registered', async () => {
    const assignor1 = makeAssignor({})
    inMemoryAssignorsRepository.create(assignor1)

    const assignor2 = makeAssignor({})
    inMemoryAssignorsRepository.create(assignor2)

    const result = await sut.execute({
      assignorId: assignor1.id.toString(),
      name: faker.person.fullName(),
      email: assignor2.email,
      phone: faker.phone.number(),
      document: String(faker.number.int({ min: 11, max: 14 })),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(AssignorWithSameEmailAlreadyExistsError)
  })

  it('should not be able to edit an assignor with same phone of one that is already registered', async () => {
    const assignor1 = makeAssignor({})
    inMemoryAssignorsRepository.create(assignor1)

    const assignor2 = makeAssignor({})
    inMemoryAssignorsRepository.create(assignor2)

    const result = await sut.execute({
      assignorId: assignor1.id.toString(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: assignor2.phone.value,
      document: String(faker.number.int({ min: 11, max: 14 })),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(AssignorWithSamePhoneAlreadyExistsError)
  })

  it('should not be able to edit an assignor with same document of one that is already registered', async () => {
    const assignor1 = makeAssignor({})
    inMemoryAssignorsRepository.create(assignor1)

    const assignor2 = makeAssignor({})
    inMemoryAssignorsRepository.create(assignor2)

    const result = await sut.execute({
      assignorId: assignor1.id.toString(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      document: assignor2.document.value,
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(
      AssignorWithSameDocumentAlreadyExistsError,
    )
  })
})
