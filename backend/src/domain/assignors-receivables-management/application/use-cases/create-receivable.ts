import { Either, left, right } from 'src/core/either'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { Receivable } from '../../enterprise/entities/receivable'
import { AssignorsRepository } from '../repositories/assignors'
import { ReceivablesRepository } from '../repositories/receivables'

type CreateReceivableUseCaseRequest = {
  assignor: string
  value: number
}

type CreateReceivableUseCaseResponse = Either<ResourceNotFoundError, unknown>

export class CreateReceivableUseCase {
  constructor(
    private receivablesRepository: ReceivablesRepository,
    private assignorsRepository: AssignorsRepository,
  ) {}

  async execute({
    assignor,
    value,
  }: CreateReceivableUseCaseRequest): Promise<CreateReceivableUseCaseResponse> {
    const assignorById = await this.assignorsRepository.findById(
      new UniqueEntityId(assignor),
    )

    if (!assignorById) {
      return left(new ResourceNotFoundError(assignor))
    }

    const receivable = Receivable.create({
      assignor: new UniqueEntityId(assignor),
      value,
    })

    await this.receivablesRepository.create(receivable)

    return right({})
  }
}
