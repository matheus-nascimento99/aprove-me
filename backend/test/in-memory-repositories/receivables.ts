import {
  PaginationParamsRequest,
  PaginationParamsResponse,
} from 'src/core/@types/pagination-params'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { ReceivablesRepository } from 'src/domain/assignors-receivables-management/application/repositories/receivables'
import { Receivable } from 'src/domain/assignors-receivables-management/enterprise/entities/receivable'

import { FilterParams } from '@/core/@types/filter-params'
import { FetchReceivablesFilterParams } from '@/domain/assignors-receivables-management/application/use-cases/fetch-receivables'

export class InMemoryReceivablesRepository implements ReceivablesRepository {
  public items: Receivable[] = []

  async create(receivable: Receivable): Promise<void> {
    this.items.push(receivable)
  }

  async findMany(
    { page, limit }: PaginationParamsRequest,
    { assignor }: FilterParams<FetchReceivablesFilterParams>,
  ): Promise<PaginationParamsResponse<Receivable>> {
    let receivables = this.items

    if (assignor) {
      receivables = receivables.filter((receivable) =>
        receivable.assignor.equals(new UniqueEntityId(assignor)),
      )
    }

    const total = receivables.length

    receivables = receivables.splice((page - 1) * limit, page * limit)

    const pages = Math.ceil(total / page)

    const next =
      Math.ceil(((page + 1) * page) / page) < pages
        ? Math.ceil(((page + 1) * page) / page)
        : null

    const prev =
      Math.ceil((page * page) / page) - 1 === 0
        ? null
        : Math.ceil((page * page) / page) - 1

    return {
      items: receivables,
      next,
      prev,
      total,
    }
  }

  async findById(receivableId: UniqueEntityId): Promise<Receivable | null> {
    const receivable = this.items.find((item) => item.id.equals(receivableId))

    if (!receivable) {
      return null
    }

    return receivable
  }

  async save(
    receivableId: UniqueEntityId,
    receivable: Receivable,
  ): Promise<void> {
    const receivableIndex = this.items.findIndex((item) =>
      item.id.equals(receivableId),
    )

    this.items[receivableIndex] = receivable
  }

  async delete(receivableId: UniqueEntityId): Promise<void> {
    const receivableIndex = this.items.findIndex((item) =>
      item.id.equals(receivableId),
    )

    this.items.splice(receivableIndex, 1)
  }
}
