import { faker } from '@faker-js/faker'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'

import {
  Receivable,
  ReceivableProps,
} from '@/domain/assignors-receivables-management/enterprise/entities/receivable'

export const makeReceivable = (
  override: Partial<ReceivableProps>,
  id?: UniqueEntityId,
) => {
  const receivable = Receivable.create(
    {
      assignor: new UniqueEntityId(),
      value: faker.number.float(),
      ...override,
    },
    id,
  )

  return receivable
}
