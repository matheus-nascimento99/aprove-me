import { randomUUID } from 'crypto'
import { UploadParamsRequest, UploadParamsResponse } from 'src/core/@types/file'
import { StorageDownloader } from 'src/core/storage/storage-downloader'
import { StorageUploader } from 'src/core/storage/storage-uploader'

export class FakeStorage implements StorageUploader, StorageDownloader {
  async upload({
    filename,
  }: UploadParamsRequest): Promise<UploadParamsResponse> {
    const key = `${randomUUID()}-${new Date().getTime()}-${filename}`

    return {
      key,
      title: filename,
    }
  }

  async download(key: string): Promise<void> {} // eslint-disable-line
}
