import { faker } from '@faker-js/faker'
import { FakeStorage } from 'test/storage/fake-storage'

let fakeStorage: FakeStorage

describe('Storage', () => {
  beforeEach(() => {
    fakeStorage = new FakeStorage()
  })

  it('should be able to upload a fake file', async () => {
    const { key, title } = await fakeStorage.upload({
      body: Buffer.from(''),
      filename: faker.lorem.word() + '.csv',
      mimeType: 'text/csv',
    })

    expect(key).toEqual(expect.any(String))
    expect(title).toEqual(expect.any(String))
  })
})
