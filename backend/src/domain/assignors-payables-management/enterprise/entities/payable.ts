import { Optional } from '@/core/@types/optional'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

export type PayableProps = {
  assignor: UniqueEntityId
  value: number
  emissionDate: Date
}

export class Payable extends Entity<PayableProps> {
  get assignor() {
    return this.props.assignor
  }

  set assignor(value: UniqueEntityId) {
    this.props.assignor = value
  }

  get value() {
    return this.props.value
  }

  set value(value: number) {
    this.props.value = value
  }

  get emissionDate() {
    return this.props.emissionDate
  }

  set emissionDate(value: Date) {
    this.props.emissionDate = value
  }

  static create(
    props: Optional<PayableProps, 'emissionDate'>,
    id?: UniqueEntityId,
  ) {
    const payable = new Payable(
      {
        ...props,
        emissionDate: props.emissionDate ?? new Date(),
      },
      id,
    )

    return payable
  }
}
