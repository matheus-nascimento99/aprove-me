import { Module } from '@nestjs/common'

import { S3Storage } from './s3-storage'
import { Storage } from './storage'

@Module({
  providers: [{ provide: Storage, useClass: S3Storage }],
  exports: [Storage],
})
export class StorageModule {}
