import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { FilterParams } from '@/core/@types/filter-params'
import {
  PaginationParamsRequest,
  PaginationParamsResponse,
} from '@/core/@types/pagination-params'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { PayablesRepository } from '@/domain/assignors-payables-management/application/repositories/payables'
import { FetchPayablesFilterParams } from '@/domain/assignors-payables-management/application/use-cases/fetch-payables'
import { Payable } from '@/domain/assignors-payables-management/enterprise/entities/payable'

import { PrismaPayablesMapper } from '../mappers/payables'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaPayablesRepository implements PayablesRepository {
  constructor(private prisma: PrismaService) {}

  async create(payable: Payable): Promise<void> {
    const data = PrismaPayablesMapper.toPrisma(payable)

    await this.prisma.payable.create({ data })
  }

  async findManyByAssignorId(
    assignorId: UniqueEntityId,
    { limit, page }: PaginationParamsRequest,
    filterParams: FilterParams<FetchPayablesFilterParams>,
  ): Promise<PaginationParamsResponse<Payable>> {
    const where: Prisma.PayableWhereInput = {
      assignorId: assignorId.toString(),
      ...filterParams,
    }

    const [payables, total] = await this.prisma.$transaction([
      this.prisma.payable.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.prisma.payable.count({
        where,
      }),
    ])

    const pages = Math.ceil(total / limit)

    const next =
      Math.ceil(((page + 1) * page) / page) < pages
        ? Math.ceil(((page + 1) * page) / page)
        : null

    const prev =
      Math.ceil((page * page) / page) - 1 === 0
        ? null
        : Math.ceil((page * page) / page) - 1

    return {
      items: payables.map((payable) => PrismaPayablesMapper.toDomain(payable)),
      total,
      prev,
      next,
    }
  }

  async findById(payableId: UniqueEntityId): Promise<Payable | null> {
    const payable = await this.prisma.payable.findUnique({
      where: { id: payableId.toString() },
    })

    if (!payable) {
      return null
    }

    return PrismaPayablesMapper.toDomain(payable)
  }

  async save(payableId: UniqueEntityId, payable: Payable): Promise<void> {
    const data = PrismaPayablesMapper.toPrisma(payable)

    await this.prisma.payable.update({
      where: { id: payableId.toString() },
      data,
    })
  }

  async delete(payableId: UniqueEntityId): Promise<void> {
    await this.prisma.payable.delete({ where: { id: payableId.toString() } })
  }
}
