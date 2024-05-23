import { HashComparer } from '@/core/hash/hash-comparer'
import { HashCreator } from '@/core/hash/hash-creator'

export class FakeHasher implements HashComparer, HashCreator {
  async hash(value: string): Promise<string> {
    const plainHashed = `${value}-hashed`

    return plainHashed
  }

  compare(plain: string, hash: string): boolean {
    const isEqual = `${plain}-hashed` === hash

    return isEqual
  }
}
