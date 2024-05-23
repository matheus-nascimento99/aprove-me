import { Entity } from 'src/core/entities/entity'

import { Raw } from '@/core/value-objects/raw'

export type UserProps = {
  name: string
  email: string
  phone: Raw
  password: string
  document: Raw
}

export abstract class User<Props extends UserProps> extends Entity<Props> {}
