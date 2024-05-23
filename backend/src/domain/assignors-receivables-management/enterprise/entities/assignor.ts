import { Raw } from '@/core/value-objects/raw'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { User, UserProps } from './user'

export type AssignorProps = UserProps

export class Assignor extends User<AssignorProps> {
  get name() {
    return this.props.name
  }

  set name(value: string) {
    this.props.name = value
  }

  get email() {
    return this.props.email
  }

  set email(value: string) {
    this.props.email = value
  }

  get phone() {
    return this.props.phone
  }

  set phone(value: Raw) {
    this.props.phone = value
  }

  get password() {
    return this.props.password
  }

  set password(value: string) {
    this.props.password = value
  }

  get document() {
    return this.props.document
  }

  set document(value: Raw) {
    this.props.document = value
  }

  static create(props: AssignorProps, id?: UniqueEntityId) {
    const assignor = new Assignor(props, id)

    return assignor
  }
}
