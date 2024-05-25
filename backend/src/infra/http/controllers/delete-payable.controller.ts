import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found'
import { DeletePayableUseCase } from '@/domain/assignors-payables-management/application/use-cases/delete-payable'

@Controller('/integrations/payable/:id')
export class DeletePayableController {
  constructor(private deletePayableUseCase: DeletePayableUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') payableId: string) {
    const result = await this.deletePayableUseCase.execute({ payableId })

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
