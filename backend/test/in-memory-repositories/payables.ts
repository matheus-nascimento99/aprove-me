import {
  PaginationParamsRequest,
  PaginationParamsResponse,
} from 'src/core/@types/pagination-params'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { PayablesRepository } from 'src/domain/assignors-payables-management/application/repositories/payables'
import { Payable } from 'src/domain/assignors-payables-management/enterprise/entities/payable'

export class InMemoryPayablesRepository implements PayablesRepository {
  public items: Payable[] = []

  async create(payable: Payable): Promise<void> {
    this.items.push(payable)
  }

  async findManyByAssignorId(
    assignorId: UniqueEntityId,
    { page, limit }: PaginationParamsRequest,
  ): Promise<PaginationParamsResponse<Payable>> {
    let payables = this.items.filter((item) => item.assignor.equals(assignorId))

    const total = payables.length

    payables = payables.splice((page - 1) * limit, page * limit)

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
      items: payables,
      next,
      prev,
      total,
    }
  }

  async findById(payableId: UniqueEntityId): Promise<Payable | null> {
    const payable = this.items.find((item) => item.id.equals(payableId))

    if (!payable) {
      return null
    }

    return payable
  }

  async save(payableId: UniqueEntityId, payable: Payable): Promise<void> {
    const payableIndex = this.items.findIndex((item) =>
      item.id.equals(payableId),
    )

    this.items[payableIndex] = payable
  }

  async delete(payableId: UniqueEntityId): Promise<void> {
    const payableIndex = this.items.findIndex((item) =>
      item.id.equals(payableId),
    )

    this.items.splice(payableIndex, 1)
  }
}
