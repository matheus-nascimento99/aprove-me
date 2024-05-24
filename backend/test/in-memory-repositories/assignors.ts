import {
  PaginationParamsRequest,
  PaginationParamsResponse,
} from 'src/core/@types/pagination-params'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { AssignorsRepository } from 'src/domain/assignors-payables-management/application/repositories/assignors'
import { Assignor } from 'src/domain/assignors-payables-management/enterprise/entities/assignor'

import { FilterParams } from '@/core/@types/filter-params'
import { FetchAssignorsFilterParams } from '@/domain/assignors-payables-management/application/use-cases/fetch-assignors'

import { InMemoryUsersRepository } from './users'

export class InMemoryAssignorsRepository implements AssignorsRepository {
  constructor(private inMemoryUsersRepository: InMemoryUsersRepository) {}

  async create(assignor: Assignor): Promise<void> {
    this.inMemoryUsersRepository.items.push(assignor)
  }

  async findMany(
    { page, limit }: PaginationParamsRequest,
    { name, email, phone, document }: FilterParams<FetchAssignorsFilterParams>,
  ): Promise<PaginationParamsResponse<Assignor>> {
    let assignors = this.inMemoryUsersRepository.items

    if (name) {
      assignors = assignors.filter((assignor) => assignor.name.includes(name))
    }

    if (email) {
      assignors = assignors.filter((assignor) => assignor.email.includes(email))
    }

    if (phone) {
      assignors = assignors.filter((assignor) =>
        assignor.phone.value.includes(phone),
      )
    }

    if (document) {
      assignors = assignors.filter((assignor) =>
        assignor.document.value.includes(document),
      )
    }

    const total = assignors.length

    assignors = assignors.splice((page - 1) * limit, page * limit)

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
      items: assignors,
      next,
      prev,
      total,
    }
  }

  async findById(assignorId: UniqueEntityId): Promise<Assignor | null> {
    const assignor = this.inMemoryUsersRepository.items.find((item) =>
      item.id.equals(assignorId),
    )

    if (!assignor) {
      return null
    }

    return assignor
  }

  async findByEmail(assignorEmail: string): Promise<Assignor | null> {
    const assignor = this.inMemoryUsersRepository.items.find(
      (item) => item.email === assignorEmail,
    )

    if (!assignor) {
      return null
    }

    return assignor
  }

  async findByPhone(assignorPhone: string): Promise<Assignor | null> {
    const assignor = this.inMemoryUsersRepository.items.find(
      (item) => item.phone.value === assignorPhone,
    )

    if (!assignor) {
      return null
    }

    return assignor
  }

  async findByDocument(assignorDocument: string): Promise<Assignor | null> {
    const assignor = this.inMemoryUsersRepository.items.find(
      (item) => item.document.value === assignorDocument,
    )

    if (!assignor) {
      return null
    }

    return assignor
  }

  async save(assignorId: UniqueEntityId, assignor: Assignor): Promise<void> {
    const assignorIndex = this.inMemoryUsersRepository.items.findIndex((item) =>
      item.id.equals(assignorId),
    )

    this.inMemoryUsersRepository.items[assignorIndex] = assignor
  }

  async delete(assignorId: UniqueEntityId): Promise<void> {
    const assignorIndex = this.inMemoryUsersRepository.items.findIndex((item) =>
      item.id.equals(assignorId),
    )

    this.inMemoryUsersRepository.items.splice(assignorIndex, 1)
  }
}
