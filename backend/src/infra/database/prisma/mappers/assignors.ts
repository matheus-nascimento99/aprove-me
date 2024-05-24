import { Prisma, User as PrismaAssignor } from '@prisma/client'

import { Raw } from '@/core/value-objects/raw'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { Assignor } from '@/domain/assignors-payables-management/enterprise/entities/assignor'

export class PrismaAssignorsMapper {
  static toDomain(assignor: PrismaAssignor): Assignor {
    return Assignor.create(
      {
        name: assignor.name,
        email: assignor.email,
        phone: Raw.create(assignor.phone),
        document: Raw.create(assignor.document),
        password: assignor.password,
      },
      new UniqueEntityId(assignor.id),
    )
  }

  static toPrisma(assignor: Assignor): Prisma.UserUncheckedCreateInput {
    return {
      id: assignor.id.toString(),
      name: assignor.name,
      email: assignor.email,
      phone: assignor.phone.value,
      document: assignor.document.value,
      password: assignor.password,
      role: 'ASSIGNOR',
    }
  }
}
