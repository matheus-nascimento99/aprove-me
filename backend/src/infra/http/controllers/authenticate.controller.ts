import {
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import { Response } from 'express'
import { z } from 'zod'

import { Public } from '@/auth/public'
import { AuthenticateUseCase } from '@/domain/assignors-payables-management/application/use-cases/authenticate'
import { InvalidCredentialsError } from '@/domain/assignors-payables-management/application/use-cases/errors/invalid-credentials'

import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const authenticateSchema = z.object({
  login: z
    .string({ required_error: 'Campo login é obrigatório.' })
    .min(1)
    .transform((value) => value.trim().toLowerCase()),
  password: z.string({ required_error: 'Campo senha é obrigatório.' }).min(1),
})

type AuthenticateSchema = z.infer<typeof authenticateSchema>

@Controller('/integrations/auth')
export class AuthenticateController {
  constructor(private authenticateUseCase: AuthenticateUseCase) {}

  @Post()
  @Public()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(authenticateSchema)) body: AuthenticateSchema,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authenticateUseCase.execute(body)

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new InternalServerErrorException()
      }
    }

    response.cookie('refresh_token', result.value.refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })

    return {
      access_token: result.value.token,
    }
  }
}
