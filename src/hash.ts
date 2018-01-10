export class Hash {
  static BYTES_SIZE = 49

  static createFromBytes(bytes: Buffer): Hash {
    const hash = new Hash()

    hash._bytes = bytes

    return hash
  }

  private _bytes: Buffer

  get bytes(): Buffer {
    return this._bytes
  }
}