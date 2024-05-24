import { FakeHasher } from './fake-hasher'

let fakeHasher: FakeHasher

describe('Hasher', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
  })

  it('should be able to hash a string', async () => {
    const plain = 'test'
    const plainHashed = await fakeHasher.hash(plain)

    expect(plainHashed).toEqual(`${plain}-hashed`)
  })

  it('should be able to compare a string with hash', async () => {
    const plain = 'test'
    const plainHashed = 'test-hashed'

    const isEqual = await fakeHasher.compare(plain, plainHashed)

    expect(isEqual).toEqual(true)
  })
})
