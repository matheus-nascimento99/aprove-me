import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Cryptographer } from '@/core/cryptography/cryptographer'

@Injectable()
export class JwtCryptographer implements Cryptographer {
  constructor(private jwt: JwtService) {}

  async encrypt(payload: Record<string, unknown>, expiresIn: string = '1m') {
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn,
    })
    return accessToken
  }
}
