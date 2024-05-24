import { randomUUID } from 'node:crypto'
import { unlink } from 'node:fs/promises'
import path from 'node:path'

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import fs from 'fs'

import { Storage, UploadParams } from './storage'
@Injectable()
export class S3Storage implements Storage {
  private client: S3Client

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_DEFAULT_REGION as string,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    })
  }

  async upload({ filename, fileType, body }: UploadParams) {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${filename}`

    if (process.env.NODE_ENV === 'development') {
      fs.writeFileSync(`./files/${uniqueFileName}`, body)
    } else {
      await this.client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Body: body,
          Key: uniqueFileName,
          ContentType: fileType,
        }),
      )
    }

    return { key: uniqueFileName }
  }

  async delete(key: string) {
    if (process.env.NODE_ENV === 'development') {
      await unlink(path.resolve(__dirname, '..', '..', 'files', key))
    } else {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
        }),
      )
    }
  }
}
