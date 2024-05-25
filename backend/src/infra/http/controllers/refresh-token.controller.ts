import {
  Controller,
  InternalServerErrorException,
  Patch,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import { Response } from 'express'

import { CurrentUser } from '@/auth/current-user'
import { UserPayload } from '@/auth/jwt.strategy'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found'
import { RefreshTokenUseCase } from '@/domain/assignors-payables-management/application/use-cases/refresh-token'

@Controller('/integrations/refresh-token')
export class RefreshTokenController {
  constructor(private refreshTokenUseCase: RefreshTokenUseCase) {}

  @Patch()
  async handle(@CurrentUser() user: UserPayload, @Res() response: Response) {
    const result = await this.refreshTokenUseCase.execute({ user })
    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
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

    return response.status(200).json({ access_token: result.value.token })
  }
}
