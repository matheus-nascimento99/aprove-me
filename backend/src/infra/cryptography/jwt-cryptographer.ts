import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Cryptographer } from '@/core/cryptography/cryptographer'

@Injectable()
export class JwtCryptographer implements Cryptographer {
  constructor(private jwt: JwtService) {}

  encrypt(payload: Record<string, unknown>) {
    return this.jwt.signAsync(payload)
  }
}
