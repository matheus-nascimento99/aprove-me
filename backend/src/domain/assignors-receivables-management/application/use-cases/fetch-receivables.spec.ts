import { PaginationParamsResponse } from 'src/core/@types/pagination-params'
import { makeAssignor } from 'test/factories/make-assignor'
import { makeReceivable } from 'test/factories/make-receivable'
import { InMemoryReceivablesRepository } from 'test/in-memory-repositories/receivables'

import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { Receivable } from '../../enterprise/entities/receivable'
import { FetchReceivablesUseCase } from './fetch-receivables'

let sut: FetchReceivablesUseCase
let inMemoryReceivablesRepository: InMemoryReceivablesRepository

describe('Fetch receivables use case', () => {
  beforeEach(() => {
    inMemoryReceivablesRepository = new InMemoryReceivablesRepository()
    sut = new FetchReceivablesUseCase(inMemoryReceivablesRepository)
  })

  it('should be able to fetch receivables', async () => {
    for (let index = 0; index < 4; index++) {
      const receivable = makeReceivable({})
      inMemoryReceivablesRepository.create(receivable)
    }

    const result = await sut.execute({
      paginationParams: { page: 1, limit: 3 },
      filterParams: {},
    })

    expect(result.isRight()).toEqual(true)
    expect(
      (result.value as PaginationParamsResponse<Receivable>).items,
    ).toHaveLength(3)
  })

  it('should be able to fetch receivables filtering by assignor', async () => {
    const assignor = makeAssignor({})

    for (let index = 0; index < 3; index++) {
      const receivable = makeReceivable({
        assignor: index < 2 ? assignor.id : new UniqueEntityId(),
      })
      inMemoryReceivablesRepository.create(receivable)
    }

    const result = await sut.execute({
      paginationParams: { page: 1, limit: 3 },
      filterParams: { assignor: assignor.id.toString() },
    })

    expect(result.isRight()).toEqual(true)
    expect(
      (result.value as PaginationParamsResponse<Receivable>).items,
    ).toHaveLength(2)
    expect(
      (result.value as PaginationParamsResponse<Receivable>).items,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ assignor: assignor.id }),
        expect.objectContaining({ assignor: assignor.id }),
      ]),
    )
  })

  it('should be able to fetch receivables paginated', async () => {
    for (let index = 0; index < 4; index++) {
      const receivable = makeReceivable({})
      inMemoryReceivablesRepository.create(receivable)
    }

    const result = await sut.execute({
      paginationParams: { page: 2, limit: 3 },
      filterParams: {},
    })

    expect(result.isRight()).toEqual(true)
    expect(
      (result.value as PaginationParamsResponse<Receivable>).items,
    ).toHaveLength(1)
  })
})
