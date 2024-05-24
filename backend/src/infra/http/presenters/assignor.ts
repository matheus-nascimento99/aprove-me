import { Assignor } from '@/domain/assignors-payables-management/enterprise/entities/assignor'

export class AssignorsPresenter {
  static toHTTP(assignor: Assignor) {
    return {
      id: assignor.id.toString(),
      name: assignor.name,
      email: assignor.email,
      phone: assignor.phone.value,
      document: assignor.document.value,
    }
  }
}
