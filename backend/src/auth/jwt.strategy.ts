import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'

import { Env } from '@/infra/env/env'

const userPayloadSchema = z.object({
  sub: z.string().uuid(),
})

export type UserPayload = z.infer<typeof userPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService<Env, true>) {
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        JwtStrategy.ExtractJwtFromCookiesAsRefreshToken,
      ]),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  private static ExtractJwtFromCookiesAsRefreshToken(req: Request) {
    if (
      req.cookies &&
      'refresh_token' in req.cookies &&
      String(req.cookies.refresh_token).length > 0
    ) {
      return req.cookies.refresh_token
    }

    return null
  }

  async validate(payload: UserPayload) {
    return userPayloadSchema.parse(payload)
  }
}
