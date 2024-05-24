import { Payable as PrismaPayable, Prisma } from '@prisma/client'

import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { Payable } from '@/domain/assignors-payables-management/enterprise/entities/payable'

export class PrismaPayablesMapper {
  static toDomain(payable: PrismaPayable): Payable {
    return Payable.create(
      {
        assignor: new UniqueEntityId(payable.assignorId),
        value: payable.value,
        emissionDate: payable.emissionDate,
      },
      new UniqueEntityId(payable.id),
    )
  }

  static toPrisma(payable: Payable): Prisma.PayableUncheckedCreateInput {
    return {
      id: payable.id.toString(),
      assignorId: payable.assignor.toString(),
      value: payable.value,
      emissionDate: payable.emissionDate,
    }
  }
}
