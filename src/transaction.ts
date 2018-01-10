import { Serializer } from './serializer'

export class Transaction {

  static BYTES_SIZE = 1604

  static createFromBytes(serializer: Serializer, bytes: Buffer) {
    if (bytes.byteLength !== Transaction.BYTES_SIZE) {
      throw new Error('Incorrecty bytes size!')
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