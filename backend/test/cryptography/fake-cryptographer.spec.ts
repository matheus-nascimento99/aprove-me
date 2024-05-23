import { faker } from '@faker-js/faker'
import { FakeCryptographer } from 'test/cryptography/fake-cryptographer'

let fakeCryptographer: FakeCryptographer

describe('Cryptographer', () => {
  beforeEach(() => {
    fakeCryptographer = new FakeCryptographer()
  })

  it('should be able to generate a token', async () => {
    const user = { id: faker.string.uuid() }
    const token = await fakeCryptographer.encrypt(user)

    expect(token).toEqual(expect.any(String))
  })
})
