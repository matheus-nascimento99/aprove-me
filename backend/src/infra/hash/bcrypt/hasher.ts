import { compare as bcryptCompare, hash as bcryptHash } from 'bcryptjs'

import { HashComparer } from '@/core/hash/hash-comparer'
import { HashCreator } from '@/core/hash/hash-creator'

export class BcryptHasher implements HashCreator, HashComparer {
  private rounds = 8

  async hash(value: string): Promise<string> {
    const hash = await bcryptHash(value, this.rounds)
    return hash
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    const isEquals = await bcryptCompare(plain, hash)

    return isEquals
  }
}
