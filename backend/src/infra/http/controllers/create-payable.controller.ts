import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { CurrentUser } from '@/auth/current-user'
import { UserPayload } from '@/auth/jwt.strategy'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found'
import { CreatePayableUseCase } from '@/domain/assignors-payables-management/application/use-cases/create-payable'

import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const createPayableSchema = z.object({
  value: z.coerce.number({
    required_error: 'O campo valor é obrigatório.',
  }),
})

type CreatePayableSchema = z.infer<typeof createPayableSchema>

@Controller('/integrations/payable')
export class CreatePayableController {
  constructor(private createPayableUseCase: CreatePayableUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(createPayableSchema))
    body: CreatePayableSchema,
  ) {
    const result = await this.createPayableUseCase.execute({
      ...body,
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
