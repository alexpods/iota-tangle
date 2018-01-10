import { Serializer } from './serializer'

export class Transaction {

  static BYTES_SIZE = 1604

  static createFromBytes(bytes: Buffer, serializer: Serializer): Transaction {
    if (bytes.byteLength !== Transaction.BYTES_SIZE) {
      throw new Error('Bytes size is incorrect!')
    }

    const transaction = new Transaction()

    transaction._serializer = serializer
    transaction._bytes = bytes

    return transaction
  }

  private _serializer: Serializer
  private _bytes: Buffer

  get bytes(): Buffer {
    return this._bytes
  }
}