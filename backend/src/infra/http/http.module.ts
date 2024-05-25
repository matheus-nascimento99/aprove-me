import { Module } from '@nestjs/common'

import { CreateAssignorUseCase } from '@/domain/assignors-payables-management/application/use-cases/create-assignor'
import { CreatePayableUseCase } from '@/domain/assignors-payables-management/application/use-cases/create-payable'
import { DeleteAssignorUseCase } from '@/domain/assignors-payables-management/application/use-cases/delete-assignor'
import { EditAssignorUseCase } from '@/domain/assignors-payables-management/application/use-cases/edit-assignor'
import { FetchAssignorsUseCase } from '@/domain/assignors-payables-management/application/use-cases/fetch-assignors'

import { DatabaseModule } from '../database/database.module'
import { HashModule } from '../hash/hash.module'
import { StorageModule } from '../storage/storage.module'
import { CreateAssignorController } from './controllers/create-assignor.controller'
import { CreatePayableController } from './controllers/create-payable.controller'
import { DeleteAssignorController } from './controllers/delete-assignor.controller'
import { EditAssignorController } from './controllers/edit-assignor.controller'
import { FetchAssignorsController } from './controllers/fetch-assignors.controller'

@Module({
  imports: [DatabaseModule, HashModule, StorageModule],
  controllers: [
    CreateAssignorController,
    CreatePayableController,
    EditAssignorController,
    DeleteAssignorController,
    FetchAssignorsController,
  ],
  providers: [
    CreateAssignorUseCase,
    CreatePayableUseCase,
    EditAssignorUseCase,
    DeleteAssignorUseCase,
    FetchAssignorsUseCase,
  ],
  exports: [
    CreateAssignorUseCase,
    CreatePayableUseCase,
    EditAssignorUseCase,
    DeleteAssignorUseCase,
    FetchAssignorsUseCase,
  ],
})
export class HttpModule {}
