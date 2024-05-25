import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found'
import { DeleteAssignorUseCase } from '@/domain/assignors-payables-management/application/use-cases/delete-assignor'

@Controller('/integrations/assignor/:id')
export class DeleteAssignorController {
  constructor(private deleteAssignorUseCase: DeleteAssignorUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') assignorId: string) {
    const result = await this.deleteAssignorUseCase.execute({ assignorId })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
