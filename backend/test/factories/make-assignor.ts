import { faker } from '@faker-js/faker'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'

import { Raw } from '@/core/value-objects/raw'
import {
  Assignor,
  AssignorProps,
} from '@/domain/assignors-receivables-management/enterprise/entities/assignor'

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
