import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { FilterParams } from '@/core/@types/filter-params'
import {
  PaginationParamsRequest,
  PaginationParamsResponse,
} from '@/core/@types/pagination-params'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { AssignorsRepository } from '@/domain/assignors-payables-management/application/repositories/assignors'
import { FetchAssignorsFilterParams } from '@/domain/assignors-payables-management/application/use-cases/fetch-assignors'
import { Assignor } from '@/domain/assignors-payables-management/enterprise/entities/assignor'

import { PrismaAssignorsMapper } from '../mappers/assignors'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAssignorsRepository implements AssignorsRepository {
  constructor(private prisma: PrismaService) {}

  async create(assignor: Assignor): Promise<void> {
    const data = PrismaAssignorsMapper.toPrisma(assignor)

    await this.prisma.user.create({ data })
  }

  async findMany(
    { limit, page }: PaginationParamsRequest,
    filterParams: FilterParams<FetchAssignorsFilterParams>,
  ): Promise<PaginationParamsResponse<Assignor>> {
    const where: {
      [K in keyof FilterParams<FetchAssignorsFilterParams>]:
        | Prisma.StringFilter<'User'>
        | string
    } = {}

    if (filterParams.name) {
      where.name = { contains: filterParams.name as string }
    }

    if (filterParams.email) {
      where.email = { contains: filterParams.email as string }
    }

    if (filterParams.phone) {
      where.phone = { contains: filterParams.phone as string }
    }

    if (filterParams.email) {
      where.email = { contains: filterParams.email as string }
    }

    const [assignors, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.prisma.user.count({ where }),
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
      items: assignors.map((assignor) =>
        PrismaAssignorsMapper.toDomain(assignor),
      ),
      total,
      prev,
      next,
    }
  }

  async findById(assignorId: UniqueEntityId): Promise<Assignor | null> {
    const assignor = await this.prisma.user.findUnique({
      where: { id: assignorId.toString() },
    })

    if (!assignor) {
      return null
    }

    return PrismaAssignorsMapper.toDomain(assignor)
  }

  async findByEmail(assignorEmail: string): Promise<Assignor | null> {
    const assignor = await this.prisma.user.findUnique({
      where: { email: assignorEmail },
    })

    if (!assignor) {
      return null
    }

    return PrismaAssignorsMapper.toDomain(assignor)
  }

  async findByPhone(assignorPhone: string): Promise<Assignor | null> {
    const assignor = await this.prisma.user.findUnique({
      where: { phone: assignorPhone },
    })

    if (!assignor) {
      return null
    }

    return PrismaAssignorsMapper.toDomain(assignor)
  }

  async findByDocument(assignorDocument: string): Promise<Assignor | null> {
    const assignor = await this.prisma.user.findUnique({
      where: { document: assignorDocument },
    })

    if (!assignor) {
      return null
    }

    return PrismaAssignorsMapper.toDomain(assignor)
  }

  async save(assignorId: UniqueEntityId, assignor: Assignor): Promise<void> {
    const data = PrismaAssignorsMapper.toPrisma(assignor)

    await this.prisma.user.update({
      where: { id: assignorId.toString() },
      data,
    })
  }

  async delete(assignorId: UniqueEntityId): Promise<void> {
    await this.prisma.user.delete({ where: { id: assignorId.toString() } })
  }
}
