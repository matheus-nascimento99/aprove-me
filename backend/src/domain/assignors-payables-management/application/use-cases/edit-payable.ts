import { Either, left, right } from 'src/core/either'
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'

import { AssignorsRepository } from '../repositories/assignors'
import { PayablesRepository } from '../repositories/payables'

type EditPayableUseCaseRequest = {
  payableId: string
  assignor: string
  value: number
}

type EditPayableUseCaseResponse = Either<ResourceNotFoundError, unknown>

export class EditPayableUseCase {
  constructor(
    private payablesRepository: PayablesRepository,
    private assignorsRepository: AssignorsRepository,
  ) {}

  async execute({
    payableId,
    assignor,
    value,
  }: EditPayableUseCaseRequest): Promise<EditPayableUseCaseResponse> {
    const payable = await this.payablesRepository.findById(
      new UniqueEntityId(payableId),
    )

    if (!payable) {
      return left(new ResourceNotFoundError(payableId))
    }

    const assignorById = await this.assignorsRepository.findById(
      new UniqueEntityId(assignor),
    )

    if (!assignorById) {
      return left(new ResourceNotFoundError(assignor))
    }

    payable.assignor = new UniqueEntityId(assignor)
    payable.value = value

    await this.payablesRepository.save(payable.id, payable)

    return right({})
  }
}
