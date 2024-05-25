import { Module } from '@nestjs/common'

import { AuthenticateUseCase } from '@/domain/assignors-payables-management/application/use-cases/authenticate'
import { CreateAssignorUseCase } from '@/domain/assignors-payables-management/application/use-cases/create-assignor'
import { CreatePayableUseCase } from '@/domain/assignors-payables-management/application/use-cases/create-payable'
import { DeleteAssignorUseCase } from '@/domain/assignors-payables-management/application/use-cases/delete-assignor'
import { DeletePayableUseCase } from '@/domain/assignors-payables-management/application/use-cases/delete-payable'
import { EditAssignorUseCase } from '@/domain/assignors-payables-management/application/use-cases/edit-assignor'
import { EditPayableUseCase } from '@/domain/assignors-payables-management/application/use-cases/edit-payable'
import { FetchAssignorsUseCase } from '@/domain/assignors-payables-management/application/use-cases/fetch-assignors'
import { FetchPayablesUseCase } from '@/domain/assignors-payables-management/application/use-cases/fetch-payables'
import { RefreshTokenUseCase } from '@/domain/assignors-payables-management/application/use-cases/refresh-token'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { HashModule } from '../hash/hash.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAssignorController } from './controllers/create-assignor.controller'
import { CreatePayableController } from './controllers/create-payable.controller'
import { DeleteAssignorController } from './controllers/delete-assignor.controller'
import { DeletePayableController } from './controllers/delete-payable.controller'
import { EditAssignorController } from './controllers/edit-assignor.controller'
import { EditPayableController } from './controllers/edit-payable.controller'
import { FetchAssignorsController } from './controllers/fetch-assignors.controller'
import { FetchPayablesController } from './controllers/fetch-payables.controller'
import { RefreshTokenController } from './controllers/refresh-token.controller'

@Module({
  imports: [DatabaseModule, HashModule, CryptographyModule],
  controllers: [
    CreateAssignorController,
    CreatePayableController,
    EditAssignorController,
    DeleteAssignorController,
    FetchAssignorsController,
    EditPayableController,
    DeletePayableController,
    FetchPayablesController,
    AuthenticateController,
    RefreshTokenController,
  ],
  providers: [
    CreateAssignorUseCase,
    CreatePayableUseCase,
    EditAssignorUseCase,
    DeleteAssignorUseCase,
    FetchAssignorsUseCase,
    EditPayableUseCase,
    DeletePayableUseCase,
    FetchPayablesUseCase,
    AuthenticateUseCase,
    RefreshTokenUseCase,
  ],
  exports: [
    CreateAssignorUseCase,
    CreatePayableUseCase,
    EditAssignorUseCase,
    DeleteAssignorUseCase,
    FetchAssignorsUseCase,
    EditPayableUseCase,
    DeletePayableUseCase,
    FetchPayablesUseCase,
    AuthenticateUseCase,
    RefreshTokenUseCase,
  ],
})
export class HttpModule {}
