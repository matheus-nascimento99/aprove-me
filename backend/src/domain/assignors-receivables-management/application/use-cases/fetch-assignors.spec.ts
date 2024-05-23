import { faker } from '@faker-js/faker'
import { PaginationParamsResponse } from 'src/core/@types/pagination-params'
import { makeAssignor } from 'test/factories/make-assignor'
import { InMemoryAssignorsRepository } from 'test/in-memory-repositories/assignors'

import { Raw } from '@/core/value-objects/raw'

import { Assignor } from '../../enterprise/entities/assignor'
import { FetchAssignorsUseCase } from './fetch-assignors'

let sut: FetchAssignorsUseCase
let inMemoryAssignorsRepository: InMemoryAssignorsRepository

describe('Fetch assignors use case', () => {
  beforeEach(() => {
    inMemoryAssignorsRepository = new InMemoryAssignorsRepository()
    sut = new FetchAssignorsUseCase(inMemoryAssignorsRepository)
  })

  it('should be able to fetch assignors', async () => {
    for (let index = 0; index < 4; index++) {
      const assignor = makeAssignor({})
      inMemoryAssignorsRepository.create(assignor)
    }

    const result = await sut.execute({
      paginationParams: { page: 1, limit: 3 },
      filterParams: {},
    })

    expect(result.isRight()).toEqual(true)
    expect(
      (result.value as PaginationParamsResponse<Assignor>).items,
    ).toHaveLength(3)
  })

  it('should be able to fetch assignors filtering by name', async () => {
    const name = faker.lorem.word()

    for (let index = 0; index < 3; index++) {
      const assignor = makeAssignor({
        name: index < 2 ? name : faker.lorem.word(),
      })
      inMemoryAssignorsRepository.create(assignor)
    }

    const result = await sut.execute({
      paginationParams: { page: 1, limit: 3 },
      filterParams: { name: name.substring(0, 3) },
    })

    expect(result.isRight()).toEqual(true)
    expect(
      (result.value as PaginationParamsResponse<Assignor>).items,
    ).toHaveLength(2)
    expect((result.value as PaginationParamsResponse<Assignor>).items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name }),
        expect.objectContaining({ name }),
      ]),
    )
  })

  it('should be able to fetch assignors filtering by email', async () => {
    const email = faker.internet.email()

    for (let index = 0; index < 3; index++) {
      const assignor = makeAssignor({
        email: index < 2 ? email : faker.lorem.word(),
      })
      inMemoryAssignorsRepository.create(assignor)
    }

    const result = await sut.execute({
      paginationParams: { page: 1, limit: 3 },
      filterParams: { email: email.substring(0, 3) },
    })

    expect(result.isRight()).toEqual(true)
    expect(
      (result.value as PaginationParamsResponse<Assignor>).items,
    ).toHaveLength(2)
    expect((result.value as PaginationParamsResponse<Assignor>).items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email }),
        expect.objectContaining({ email }),
      ]),
    )
  })

  it('should be able to fetch assignors filtering by phone', async () => {
    const phone = faker.phone.number()

    for (let index = 0; index < 3; index++) {
      const assignor = makeAssignor({
        phone:
          index < 2
            ? Raw.createFromText(phone)
            : Raw.create(faker.phone.number()),
      })
      inMemoryAssignorsRepository.create(assignor)
    }

    const result = await sut.execute({
      paginationParams: { page: 1, limit: 3 },
      filterParams: { phone: phone.substring(0, 3) },
    })

    expect(result.isRight()).toEqual(true)
    expect(
      (result.value as PaginationParamsResponse<Assignor>).items,
    ).toHaveLength(2)
    expect((result.value as PaginationParamsResponse<Assignor>).items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ phone: Raw.createFromText(phone) }),
        expect.objectContaining({ phone: Raw.createFromText(phone) }),
      ]),
    )
  })

  it('should be able to fetch assignors filtering by document', async () => {
    const document = String(faker.number.int({ min: 11, max: 14 }))

    for (let index = 0; index < 3; index++) {
      const assignor = makeAssignor({
        document:
          index < 2
            ? Raw.createFromText(document)
            : Raw.create(String(faker.number.int({ min: 11, max: 14 }))),
      })
      inMemoryAssignorsRepository.create(assignor)
    }

    const result = await sut.execute({
      paginationParams: { page: 1, limit: 3 },
      filterParams: { document: document.substring(0, 3) },
    })

    expect(result.isRight()).toEqual(true)
    expect(
      (result.value as PaginationParamsResponse<Assignor>).items,
    ).toHaveLength(2)
    expect((result.value as PaginationParamsResponse<Assignor>).items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ document: Raw.createFromText(document) }),
        expect.objectContaining({ document: Raw.createFromText(document) }),
      ]),
    )
  })

  it('should be able to fetch assignors paginated', async () => {
    for (let index = 0; index < 4; index++) {
      const assignor = makeAssignor({})
      inMemoryAssignorsRepository.create(assignor)
    }

    const result = await sut.execute({
      paginationParams: { page: 2, limit: 3 },
      filterParams: {},
    })

    expect(result.isRight()).toEqual(true)
    expect(
      (result.value as PaginationParamsResponse<Assignor>).items,
    ).toHaveLength(1)
  })
})
