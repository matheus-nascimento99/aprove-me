import { randomUUID } from 'crypto'

export class UniqueEntityId {
  private id: string

  toValue() {
    return this.id
  }

  toString() {
    return this.id.toString()
  }

  equals(id: UniqueEntityId) {
    return this.toString() === id.toString()
  }

  constructor(id?: string) {
    this.id = id ?? randomUUID()
  }
}
