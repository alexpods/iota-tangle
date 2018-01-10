import { Transaction } from './transaction'
import { Serializer } from './serializer'

export interface FactoryParams {
  serializer: Serializer
}

export class Factory {

  private _serializer: Serializer

  constructor(params: FactoryParams) {
    this._serializer = params.serializer
  }

  createTransactionFromBytes(buffer: Buffer) {
    return Transaction.createFromBytes(this._serializer, buffer)
  }
}
