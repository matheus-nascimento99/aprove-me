import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Param,
  Put,
} from '@nestjs/common'
import z from 'zod'

import { CurrentUser } from '@/auth/current-user'
import { UserPayload } from '@/auth/jwt.strategy'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found'
import { EditPayableUseCase } from '@/domain/assignors-payables-management/application/use-cases/edit-payable'

import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const editPayableSchema = z.object({
  value: z.coerce.number({
    required_error: 'O campo valor é obrigatório.',
  }),
})

type EditPayableSchema = z.infer<typeof editPayableSchema>

@Controller('/integrations/payable/:id')
export class EditPayableController {
  constructor(private editPayableUseCase: EditPayableUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') payableId: string,
    @Body(new ZodValidationPipe(editPayableSchema)) body: EditPayableSchema,
  ) {
    const result = await this.editPayableUseCase.execute({
      ...body,
      payableId,
      assignor: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new InternalServerErrorException()
      }
    }
  }
}
