import { Payable } from '@/domain/assignors-payables-management/enterprise/entities/payable'

export class PayablesPresenter {
  static toHTTP(payable: Payable) {
    return {
      id: payable.id.toString(),
      assignorId: payable.assignor.toString(),
      value: payable.value,
      emissionDate: payable.emissionDate,
    }
  }
}
