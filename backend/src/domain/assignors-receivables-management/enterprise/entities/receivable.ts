import { Optional } from '@/core/@types/optional'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

export type ReceivableProps = {
  assignor: UniqueEntityId
  value: number
  emissionDate: Date
}

export class Receivable extends Entity<ReceivableProps> {
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
    props: Optional<ReceivableProps, 'emissionDate'>,
    id?: UniqueEntityId,
  ) {
    const receivable = new Receivable(
      {
        ...props,
        emissionDate: props.emissionDate ?? new Date(),
      },
      id,
    )

    return receivable
  }
}
