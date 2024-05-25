import { Module } from '@nestjs/common'

import { CreateAssignorUseCase } from '@/domain/assignors-payables-management/application/use-cases/create-assignor'
import { CreatePayableUseCase } from '@/domain/assignors-payables-management/application/use-cases/create-payable'
import { EditAssignorUseCase } from '@/domain/assignors-payables-management/application/use-cases/edit-assignor'

import { DatabaseModule } from '../database/database.module'
import { HashModule } from '../hash/hash.module'
import { StorageModule } from '../storage/storage.module'
import { CreateAssignorController } from './controllers/create-assignor.controller'
import { CreatePayableController } from './controllers/create-payable.controller'
import { EditAssignorController } from './controllers/edit-assignor.controller'

@Module({
  imports: [DatabaseModule, HashModule, StorageModule],
  controllers: [
    CreateAssignorController,
    CreatePayableController,
    EditAssignorController,
  ],
  providers: [CreateAssignorUseCase, CreatePayableUseCase, EditAssignorUseCase],
  exports: [CreateAssignorUseCase, CreatePayableUseCase, EditAssignorUseCase],
})
export class HttpModule {}
