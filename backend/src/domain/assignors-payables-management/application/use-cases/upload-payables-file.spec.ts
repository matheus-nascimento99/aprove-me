import { faker } from '@faker-js/faker'
import { FakeStorage } from 'test/storage/fake-storage'

import { InvalidAttachmentTypeError } from '@/core/errors/invalid-attachment-type'

import { UploadPayablesFileUseCase } from './upload-payables-file'

let sut: UploadPayablesFileUseCase
let fakeStorage: FakeStorage

describe('Upload payables file use case', () => {
  beforeEach(() => {
    fakeStorage = new FakeStorage()
    sut = new UploadPayablesFileUseCase(fakeStorage)
  })

  it('should be able to upload a payables file', async () => {
    const result = await sut.execute({
      body: Buffer.from(''),
      filename: faker.lorem.word() + '.csv',
      mimeType: 'text/csv',
    })

    expect(result.isRight()).toEqual(true)
    expect((result.value as { key: string }).key).toEqual(expect.any(String))
  })

  it('should not be able to upload an invalid mimetype file', async () => {
    const result = await sut.execute({
      body: Buffer.from(''),
      filename: faker.lorem.word() + '.png',
      mimeType: 'image/png',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
