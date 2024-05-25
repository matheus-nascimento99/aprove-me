import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'

import { AssignorsRepository } from '../repositories/assignors'

type DeleteAssignorUseCaseRequest = {
  assignorId: string
}

type DeleteAssignorUseCaseResponse = Either<ResourceNotFoundError, unknown>

@Injectable()
export class DeleteAssignorUseCase {
  constructor(private assignorsRepository: AssignorsRepository) {}

  async execute({
    assignorId,
  }: DeleteAssignorUseCaseRequest): Promise<DeleteAssignorUseCaseResponse> {
    const assignor = await this.assignorsRepository.findById(
      new UniqueEntityId(assignorId),
    )

    if (!assignor) {
      return left(new ResourceNotFoundError(assignorId))
    }

    await this.assignorsRepository.delete(assignor.id)

    return right({})
  }
}
