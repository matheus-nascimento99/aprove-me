import { Entity } from 'src/core/entities/entity'

import { Raw } from '@/core/value-objects/raw'

export type UserProps = {
  name: string
  email: string
  phone: Raw
  password: string
  document: Raw
}

export abstract class User<Props extends UserProps> extends Entity<Props> {
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
}
