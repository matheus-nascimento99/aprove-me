import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { User, UserProps } from './user'

export type AssignorProps = UserProps

export class Assignor extends User<AssignorProps> {
  static create(props: AssignorProps, id?: UniqueEntityId) {
    const assignor = new Assignor(props, id)

    return assignor
  }
}
