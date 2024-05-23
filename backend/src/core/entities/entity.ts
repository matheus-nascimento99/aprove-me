import { UniqueEntityId } from '../value-objects/unique-entity-id'

export class Entity<Props> {
  protected props: Props
  private _id: UniqueEntityId

  get id() {
    return this._id
  }

  constructor(props: Props, id?: UniqueEntityId) {
    this.props = props
    this._id = id ?? new UniqueEntityId()
  }
}
