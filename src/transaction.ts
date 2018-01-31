import {
  trit,
  bytesToTrits,
  tritsToTrytes,
  tritsToBytes,
  trytesToTrits,
  tritsToNumber,
  numberToTrytes,
} from "iota-ternary"

export type TransactionField = (
  "address" | "value" | "obsoleteTag" | "timestamp" | "currentIndex" | "lastIndex" | "bundle" |
  "trunk" | "branch" | "tag" | "attachmentTimestamp" | "attachmentTimestampLowerBound" |
  "attachmentTimestampUpperBound" | "nonce" | "message"
)

const Curl = require("iota.lib.js/lib/crypto/curl/curl")

export interface TransactionData {
  hash?: string
  address: string
  value: number
  obsoleteTag: string
  timestamp: number
  currentIndex: number
  lastIndex: number
  bundle: string
  trunk: string
  branch: string
  tag: string
  attachmentTimestamp: number
  attachmentTimestampLowerBound: number
  attachmentTimestampUpperBound: number
  nonce: string
  message: string
}

export class Transaction {
  static SUPPLY = 2779530283277761
  static HASH_SIZE = 243
  static MESSAGE_OFFSET = 0
  static MESSAGE_SIZE = 6561
  static ADDRESS_OFFSET = 6561
  static ADDRESS_SIZE = 243
  static VALUE_OFFSET = 6804
  static VALUE_SIZE = 81
  static VALUE_USABLE_SIZE = 33
  static OBSOLETE_TAG_OFFSET = 6885
  static OBSOLETE_TAG_SIZE = 81
  static TIMESTAMP_OFFSET = 6966
  static TIMESTAMP_SIZE = 27
  static CURRENT_INDEX_OFFSET = 6993
  static CURRENT_INDEX_SIZE = 27
  static LAST_INDEX_OFFSET = 7020
  static LAST_INDEX_SIZE =   27
  static BUNDLE_OFFSET = 7047
  static BUNDLE_SIZE = 243
  static TRUNK_OFFSET = 7290
  static TRUNK_SIZE = 243
  static BRANCH_OFFSET = 7533
  static BRANCH_SIZE = 243
  static TAG_OFFSET = 7776
  static TAG_SIZE = 81
  static ATTACHMENT_TIMESTAMP_OFFSET = 7857
  static ATTACHMENT_TIMESTAMP_SIZE = 27
  static ATTACHMENT_TIMESTAMP_LOWER_BOUND_OFFSET = 7884
  static ATTACHMENT_TIMESTAMP_LOWER_BOUND_SIZE = 27
  static ATTACHMENT_TIMESTAMP_UPPER_BOUND_OFFSET = 7911
  static ATTACHMENT_TIMESTAMP_UPPER_BOUND_SIZE = 27
  static NONCE_OFFSET = 7938
  static NONCE_SIZE = 81
  static ESSENCE_OFFSET = 6561
  static ESSENCE_SIZE = 486
  static SIZE = 8019

  static createFromBytes(bytes: Buffer, attributes?: { [attribute: string]: any }): Transaction {
    const transaction = new Transaction()

    transaction._bytes = bytes
    transaction._attributes = attributes || {}

    return transaction
  }

  static createFromTrytes(trytes: string, attributes?: { [attribute: string]: any }): Transaction {
    const transaction = new Transaction()

    transaction._trytes = trytes
    transaction._attributes = attributes || {}

    return transaction
  }

  static createFromTrits(trits: trit[], attributes?: { [attribute: string]: any }): Transaction {
    const transaction = new Transaction()

    transaction._trits = trits
    transaction._attributes = attributes || {}

    return transaction
  }

  static createFromData(data: TransactionData,  attributes?: { [attribute: string]: any }): Transaction {
    const transaction = new Transaction()

    if (typeof data.hash !== "undefined") {
      transaction._hash = data.hash
    }

    transaction._address = data.address

    transaction._value = data.value

    transaction._obsoleteTag = data.obsoleteTag
    transaction._timestamp   = data.timestamp

    transaction._currentIndex = data.currentIndex
    transaction._lastIndex    = data.lastIndex

    transaction._bundle = data.bundle
    transaction._trunk  = data.trunk
    transaction._branch = data.branch

    transaction._tag = data.tag

    transaction._attachmentTimestamp = data.attachmentTimestamp
    transaction._attachmentTimestampLowerBound = data.attachmentTimestampLowerBound
    transaction._attachmentTimestampUpperBound = data.attachmentTimestampUpperBound

    transaction._nonce = data.nonce

    transaction._message = `${data.message}`.padEnd(Transaction.MESSAGE_SIZE/3, '9')

    transaction._attributes = attributes || {}

    return transaction
  }

  private _hash: string

  private _bytes:  Buffer
  private _trits:  trit[]
  private _trytes: string

  private _address: string
  private _value: number
  private _obsoleteTag: string
  private _timestamp: number
  private _currentIndex: number
  private _lastIndex: number
  private _bundle: string
  private _trunk: string
  private _branch: string
  private _tag: string
  private _attachmentTimestamp: number
  private _attachmentTimestampLowerBound: number
  private _attachmentTimestampUpperBound: number
  private _nonce: string

  private _message: string

  private _weightMagnitude: number

  private _attributes: { [attribute: string]: any }


  get hash(): string {
    if (typeof this._hash === "undefined") {
      this._hash = tritsToTrytes(this.calculateHash())
    }

    return this._hash
  }

  get address(): string {
    if (typeof this._address === "undefined") {
      this._address = this.trytes("address")
    }

    return this._address
  }

  get value(): number {
    if (typeof this._value === "undefined") {
      this._value = tritsToNumber(this.trits("value"))
    }

    return this._value
  }

  get obsoleteTag(): string {
    if (typeof this._obsoleteTag === "undefined") {
      this._obsoleteTag = this.trytes("obsoleteTag")
    }

    return this._obsoleteTag
  }

  get timestamp(): number {
    if (typeof this._timestamp === "undefined") {
      this._timestamp = tritsToNumber(this.trits("timestamp"))
    }

    return this._timestamp
  }

  get currentIndex(): number {
    if (typeof this._currentIndex === "undefined") {
      this._currentIndex = tritsToNumber(this.trits("currentIndex"))
    }

    return this._currentIndex
  }

  get lastIndex(): number {
    if (typeof this._lastIndex === "undefined") {
      this._lastIndex = tritsToNumber(this.trits("lastIndex"))
    }

    return this._lastIndex
  }

  get bundle(): string {
    if (typeof this._bundle === "undefined") {
      this._bundle = this.trytes("bundle")
    }

    return this._bundle
  }

  get trunk(): string {
    if (typeof this._trunk === "undefined") {
      this._trunk = this.trytes("trunk")
    }

    return this._trunk
  }

  get branch(): string {
    if (typeof this._branch === "undefined") {
      this._branch = this.trytes("branch")
    }

    return this._branch
  }

  get tag(): string {
    if (typeof this._tag === "undefined") {
      this._tag = this.trytes("tag")
    }

    return this._tag
  }

  get attachmentTimestamp(): number {
    if (typeof this._attachmentTimestamp === "undefined") {
      this._attachmentTimestamp = tritsToNumber(this.trits("attachmentTimestamp"))
    }

    return this._attachmentTimestamp
  }

  get attachmentTimestampLowerBound(): number {
    if (typeof this._attachmentTimestampLowerBound === "undefined") {
      this._attachmentTimestampLowerBound = tritsToNumber(this.trits("attachmentTimestampLowerBound"))
    }

    return this._attachmentTimestampLowerBound
  }

  get attachmentTimestampUpperBound(): number {
    if (typeof this._attachmentTimestampUpperBound === "undefined") {
      this._attachmentTimestampUpperBound = tritsToNumber(this.trits("attachmentTimestampUpperBound"))
    }

    return this._attachmentTimestampUpperBound
  }

  get nonce(): string {
    if (typeof this._nonce === "undefined") {
      this._nonce = this.trytes("nonce")
    }

    return this._nonce
  }

  get message(): string {
    if (typeof this._message === "undefined") {
      this._message = this.trytes("message")
    }

    return this._message
  }

  get weightMagnitude(): number {
    if (typeof this._weightMagnitude === "undefined") {
      let hashTrits: trit[]

      if (!this._hash) {
        hashTrits = this.calculateHash()
        this._hash = tritsToTrytes(hashTrits)
      } else {
        hashTrits = trytesToTrits(this._hash)
      }

      const size = hashTrits.length

      for (let i = size; --i >= 0;) {
        if (hashTrits[i]) {
          return size - i - 1
        }
      }

      this._weightMagnitude =  hashTrits.length
    }

    return this._weightMagnitude
  }

  get(attribute: string): any {
    return this._attributes[attribute]
  }

  has(attribute: string): boolean {
    return attribute in this._attributes
  }

  set(attribute: string, value: any): this {
    this._attributes[attribute] = value
    return this
  }


  bytes(): Buffer {
    if (!this._bytes) {
      this._updateBytes()
    }

    return this._bytes
  }

  trits(field?: TransactionField | "essence"): trit[] {
    if (!this._trits) {
      this._updateTrits()
    }

    if (field === "essence") {
      return this._trits.slice(
        Transaction.ESSENCE_OFFSET,
        Transaction.ESSENCE_OFFSET + Transaction.ESSENCE_SIZE,
      )
    }

    if (field) {
      switch (field) {
        case "message":
          return this._trits.slice(
            Transaction.MESSAGE_OFFSET,
            Transaction.MESSAGE_OFFSET + Transaction.MESSAGE_SIZE,
          )
        case "address":
          return this._trits.slice(
            Transaction.ADDRESS_OFFSET,
            Transaction.ADDRESS_OFFSET + Transaction.ADDRESS_SIZE,
          )
        case "value":
          return this._trits.slice(
            Transaction.VALUE_OFFSET,
            Transaction.VALUE_OFFSET + Transaction.VALUE_SIZE
          )
        case "obsoleteTag":
          return this._trits.slice(
            Transaction.OBSOLETE_TAG_OFFSET,
            Transaction.OBSOLETE_TAG_OFFSET + Transaction.OBSOLETE_TAG_SIZE
          )
        case "timestamp":
          return this._trits.slice(
            Transaction.TIMESTAMP_OFFSET,
            Transaction.TIMESTAMP_OFFSET + Transaction.TIMESTAMP_SIZE
          )
        case "currentIndex":
          return this._trits.slice(
            Transaction.CURRENT_INDEX_OFFSET,
            Transaction.CURRENT_INDEX_OFFSET + Transaction.CURRENT_INDEX_SIZE
          )
        case "lastIndex":
          return this._trits.slice(
            Transaction.LAST_INDEX_OFFSET,
            Transaction.LAST_INDEX_OFFSET + Transaction.LAST_INDEX_SIZE
          )
        case "bundle":
          return this._trits.slice(
            Transaction.BUNDLE_OFFSET,
            Transaction.BUNDLE_OFFSET + Transaction.BUNDLE_SIZE,
          )
        case "trunk":
          return this._trits.slice(
            Transaction.TRUNK_OFFSET,
            Transaction.TRUNK_OFFSET + Transaction.TRUNK_SIZE,
          )
        case "branch":
          return this._trits.slice(
            Transaction.BRANCH_OFFSET,
            Transaction.BRANCH_OFFSET + Transaction.BRANCH_SIZE,
          )
        case "tag":
          return this._trits.slice(
            Transaction.TAG_OFFSET,
            Transaction.TAG_OFFSET + Transaction.TAG_SIZE,
          )
        case "attachmentTimestamp":
          return this._trits.slice(
            Transaction.ATTACHMENT_TIMESTAMP_OFFSET,
            Transaction.ATTACHMENT_TIMESTAMP_OFFSET + Transaction.ATTACHMENT_TIMESTAMP_SIZE,
          )
        case "attachmentTimestampLowerBound":
          return this._trits.slice(
            Transaction.ATTACHMENT_TIMESTAMP_LOWER_BOUND_OFFSET,
            Transaction.ATTACHMENT_TIMESTAMP_LOWER_BOUND_OFFSET
            +
            Transaction.ATTACHMENT_TIMESTAMP_LOWER_BOUND_SIZE
          )
        case "attachmentTimestampUpperBound":
          return this._trits.slice(
            Transaction.ATTACHMENT_TIMESTAMP_UPPER_BOUND_OFFSET,
            Transaction.ATTACHMENT_TIMESTAMP_UPPER_BOUND_OFFSET
            +
            Transaction.ATTACHMENT_TIMESTAMP_UPPER_BOUND_SIZE
          )
        case "nonce":
          return this._trits.slice(
            Transaction.NONCE_OFFSET,
            Transaction.NONCE_OFFSET + Transaction.NONCE_SIZE,
          )
        default:
          throw new Error(`Incorrect field name ${field}!`)
      }
    }

    return this._trits
  }

  trytes(field?: TransactionField | "essence"): string {
    if (!this._trytes) {
      this._updateTrytes()
    }

    if (field === "essence") {
      return this._trytes.slice(
        (Transaction.ESSENCE_OFFSET)/3,
        (Transaction.ESSENCE_OFFSET + Transaction.ESSENCE_SIZE)/3,
      )
    }

    if (field) {
      switch (field) {
        case "message":
          return this._trytes.slice(
            (Transaction.MESSAGE_OFFSET)/3,
            (Transaction.MESSAGE_OFFSET + Transaction.MESSAGE_SIZE)/3,
          )
        case "address":
          return this._trytes.slice(
            (Transaction.ADDRESS_OFFSET)/3,
            (Transaction.ADDRESS_OFFSET + Transaction.ADDRESS_SIZE)/3,
          )
        case "value":
          return this._trytes.slice(
            (Transaction.VALUE_OFFSET)/3,
            (Transaction.VALUE_OFFSET + Transaction.VALUE_SIZE)/3
          )
        case "obsoleteTag":
          return this._trytes.slice(
            (Transaction.OBSOLETE_TAG_OFFSET)/3,
            (Transaction.OBSOLETE_TAG_OFFSET + Transaction.OBSOLETE_TAG_SIZE)/3
          )
        case "timestamp":
          return this._trytes.slice(
            (Transaction.TIMESTAMP_OFFSET)/3,
            (Transaction.TIMESTAMP_OFFSET + Transaction.TIMESTAMP_SIZE)/3
          )
        case "currentIndex":
          return this._trytes.slice(
            (Transaction.CURRENT_INDEX_OFFSET)/3,
            (Transaction.CURRENT_INDEX_OFFSET + Transaction.CURRENT_INDEX_SIZE)/3
          )
        case "lastIndex":
          return this._trytes.slice(
            (Transaction.LAST_INDEX_OFFSET)/3,
            (Transaction.LAST_INDEX_OFFSET + Transaction.LAST_INDEX_SIZE)/3
          )
        case "bundle":
          return this._trytes.slice(
            (Transaction.BUNDLE_OFFSET)/3,
            (Transaction.BUNDLE_OFFSET + Transaction.BUNDLE_SIZE)/3,
          )
        case "trunk":
          return this._trytes.slice(
            (Transaction.TRUNK_OFFSET)/3,
            (Transaction.TRUNK_OFFSET + Transaction.TRUNK_SIZE)/3,
          )
        case "branch":
          return this._trytes.slice(
            (Transaction.BRANCH_OFFSET)/3,
            (Transaction.BRANCH_OFFSET + Transaction.BRANCH_SIZE)/3,
          )
        case "tag":
          return this._trytes.slice(
            (Transaction.TAG_OFFSET)/3,
            (Transaction.TAG_OFFSET + Transaction.TAG_SIZE)/3,
          )
        case "attachmentTimestamp":
          return this._trytes.slice(
            (Transaction.ATTACHMENT_TIMESTAMP_OFFSET)/3,
            (Transaction.ATTACHMENT_TIMESTAMP_OFFSET + Transaction.ATTACHMENT_TIMESTAMP_SIZE)/3,
          )
        case "attachmentTimestampLowerBound":
          return this._trytes.slice(
            (Transaction.ATTACHMENT_TIMESTAMP_LOWER_BOUND_OFFSET)/3,
            (Transaction.ATTACHMENT_TIMESTAMP_LOWER_BOUND_OFFSET
            +
            Transaction.ATTACHMENT_TIMESTAMP_LOWER_BOUND_SIZE)/3
          )
        case "attachmentTimestampUpperBound":
          return this._trytes.slice(
            (Transaction.ATTACHMENT_TIMESTAMP_UPPER_BOUND_OFFSET)/3,
            (Transaction.ATTACHMENT_TIMESTAMP_UPPER_BOUND_OFFSET
            +
            Transaction.ATTACHMENT_TIMESTAMP_UPPER_BOUND_SIZE)/3
          )
        case "nonce":
          return this._trytes.slice(
            (Transaction.NONCE_OFFSET)/3,
            (Transaction.NONCE_OFFSET + Transaction.NONCE_SIZE)/3,
          )
        default:
          throw new Error(`Incorrect field name ${field}!`)
      }
    }

    return this._trytes
  }

  calculateHash(): trit[] {
    if (!this._trits) {
      this._updateTrits()
    }

    const hash = new Array<trit>(Transaction.HASH_SIZE)
    const curl = new Curl()

    curl.initialize()
    curl.absorb(this._trits, 0, Transaction.SIZE)
    curl.squeeze(hash, 0, Transaction.HASH_SIZE)

    return hash
  }

  private _updateBytes(): void {
    if (this._trits) {
      this._bytes = tritsToBytes(this._trits)
      return
    }

    if (this._trytes) {
      this._trits = trytesToTrits(this._trytes)
      this._bytes = tritsToBytes(this._trits)
      return
    }

    if (typeof this._address !== "undefined") {
      this._trytes = this._composeFieldsToTrytes()
      this._trits  = trytesToTrits(this._trytes)
      this._bytes  = tritsToBytes(this._trits)
      return
    }

    throw new Error("Couldn't retrieve transaction bytes!")
  }

  private _updateTrits(): void {
    if (this._trytes) {
      this._trits = trytesToTrits(this._trytes)
      return
    }

    if (this._bytes) {
      this._trits = bytesToTrits(this._bytes).slice(0, Transaction.SIZE)
      return
    }

    if (typeof this._address !== "undefined") {
      this._trytes = this._composeFieldsToTrytes()
      this._trits  = trytesToTrits(this._trytes)
      return
    }

    throw new Error("Couldn't retrieve transaction trits!")
  }

  private _updateTrytes(): void {
    if (this._trits) {
      this._trytes = tritsToTrytes(this._trits)
      return
    }

    if (this._bytes) {
      this._trits  = bytesToTrits(this._bytes).slice(0, Transaction.SIZE)
      this._trytes = tritsToTrytes(this._trits)
      return
    }

    if (typeof this._address !== "undefined") {
      this._trytes = this._composeFieldsToTrytes()
      return
    }

    throw new Error("Couldn't retrieve transaction trytes!")
  }

  private _composeFieldsToTrytes() {
    return "" +
      this._message["padEnd"](Transaction.MESSAGE_SIZE/3, "9") +
      this._address["padEnd"](Transaction.ADDRESS_SIZE/3, "9") +
      numberToTrytes(this._value)["padEnd"](Transaction.VALUE_SIZE/3, "9") +
      this._obsoleteTag["padEnd"](Transaction.OBSOLETE_TAG_SIZE/3, "9") +
      numberToTrytes(this._timestamp)["padEnd"](Transaction.TIMESTAMP_SIZE/3, "9") +
      numberToTrytes(this._currentIndex)["padEnd"](Transaction.CURRENT_INDEX_SIZE/3, "9") +
      numberToTrytes(this._lastIndex)["padEnd"](Transaction.LAST_INDEX_SIZE/3, "9") +
      this._bundle["padEnd"](Transaction.BUNDLE_SIZE/3, "9") +
      this._trunk["padEnd"](Transaction.TRUNK_SIZE/3, "9") +
      this._branch["padEnd"](Transaction.BRANCH_SIZE/3, "9") +
      this._tag["padEnd"](Transaction.TAG_SIZE/3, "9") +
      numberToTrytes(this._attachmentTimestamp)["padEnd"](Transaction.ATTACHMENT_TIMESTAMP_SIZE/3, "9") +
      numberToTrytes(this._attachmentTimestampLowerBound)["padEnd"](Transaction.ATTACHMENT_TIMESTAMP_LOWER_BOUND_SIZE/3, "9") +
      numberToTrytes(this._attachmentTimestampUpperBound)["padEnd"](Transaction.ATTACHMENT_TIMESTAMP_UPPER_BOUND_SIZE/3, "9") +
      this._nonce["padEnd"](Transaction.NONCE_SIZE/3, "9")
  }
}
