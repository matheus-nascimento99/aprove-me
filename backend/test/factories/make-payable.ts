import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'

import {
  Payable,
  PayableProps,
} from '@/domain/assignors-payables-management/enterprise/entities/payable'
import { PrismaPayablesMapper } from '@/infra/database/prisma/mappers/payables'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export const makePayable = (
  override: Partial<PayableProps>,
  id?: UniqueEntityId,
) => {
  const payable = Payable.create(
    {
      assignor: new UniqueEntityId(),
      value: faker.number.float(),
      ...override,
    },
    id,
  )

  return payable
}

@Injectable()
export class PayableFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPayable(override: Partial<PayableProps> = {}) {
    const payable = makePayable({
      ...override,
    })
    const data = PrismaPayablesMapper.toPrisma(payable)

    await this.prisma.payable.create({
      data,
    })

    return payable
  }
}
