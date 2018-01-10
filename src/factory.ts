import { Transaction } from './transaction'
import { Hash } from './hash'
import { Serializer } from './serializer'

export interface FactoryParams {
  serializer: Serializer
}

export class Factory {

  private _serializer: Serializer

  constructor(params: FactoryParams) {
    this._serializer = params.serializer
  }

  createTransactionFromBytes(bytes: Buffer): Transaction {
    return Transaction.createFromBytes(bytes, this._serializer)
  }

  createHashFromBytes(bytes: Buffer): Hash {
    return Hash.createFromBytes(bytes)
  }
}
