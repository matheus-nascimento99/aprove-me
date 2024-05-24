import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'

import { Raw } from '@/core/value-objects/raw'
import {
  Assignor,
  AssignorProps,
} from '@/domain/assignors-payables-management/enterprise/entities/assignor'
import { PrismaAssignorsMapper } from '@/infra/database/prisma/mappers/assignors'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DEFAULT_PASSWORD } from '@/utils/default-password'

export const makeAssignor = (
  override: Partial<AssignorProps>,
  id?: UniqueEntityId,
) => {
  const assignor = Assignor.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: Raw.createFromText(faker.phone.number()),
      password: faker.internet.password(),
      document: Raw.create(String(faker.number.int({ min: 11, max: 14 }))),
      ...override,
    },
    id,
  )

  return assignor
}

@Injectable()
export class AssignorFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAssignor(override: Partial<AssignorProps> = {}) {
    const assignor = makeAssignor({
      ...override,
      password: await hash(override.password ?? DEFAULT_PASSWORD, 8),
    })
    const data = PrismaAssignorsMapper.toPrisma(assignor)

    await this.prisma.user.create({
      data,
    })

    return assignor
  }
}
