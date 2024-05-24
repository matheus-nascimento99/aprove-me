import { Either, left, right } from '@/core/either'
import { InvalidAttachmentTypeError } from '@/core/errors/invalid-attachment-type'
import { StorageUploader } from '@/core/storage/storage-uploader'

type UploadPayablesFileUseCaseRequest = {
  body: Buffer
  mimeType: string
  filename: string
}

type UploadPayablesFileUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  { key: string }
>

export class UploadPayablesFileUseCase {
  constructor(private uploader: StorageUploader) {}
  async execute({
    body,
    mimeType,
    filename,
  }: UploadPayablesFileUseCaseRequest): Promise<UploadPayablesFileUseCaseResponse> {
    if (!/^text\/(csv)$/.test(mimeType)) {
      return left(new InvalidAttachmentTypeError(mimeType))
    }

    const { key } = await this.uploader.upload({
      body,
      filename,
      mimeType,
    })

    return right({ key })
  }
}
